'use strict';

var path = require('path');
var fs   = require('fs');
var resolve = require('resolve');
var jshintTrees = require('broccoli-jshint');
var MergeTrees = require('broccoli-merge-trees');
var BabelTranspiler = require('broccoli-babel-transpiler');
var Concat = require('broccoli-concat');
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'Ember CLI QUnit',

  _getDependencyTrees: function() {
    if (this._dependencyTrees) {
      return this._dependencyTrees;
    }

    var emberQUnitPath = path.dirname(resolve.sync('ember-qunit'));
    var emberTestHelpersPath = path.dirname(resolve.sync('ember-test-helpers', { basedir: emberQUnitPath }));
    var klassyPath = path.dirname(resolve.sync('klassy', { basedir: emberTestHelpersPath }));

    this._dependencyTrees = [
      this.treeGenerator(emberQUnitPath),
      this.treeGenerator(emberTestHelpersPath),
      this.treeGenerator(klassyPath)
    ];

    return this._dependencyTrees;
  },

  buildConsole: function() {
    var ui = this.ui;

    if (!ui) {
      this.console = console;
      return;
    }

    this.console = {
      log: function(data) {
        ui.writeLine(data);
      },

      error: function(data) {
        ui.writeLine(data, 'ERROR');
      }
    };
  },

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    this.buildConsole();

    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    this._shouldImportEmberQUnit = !dep.gt('2.2.0-alpha');
    // fixed in https://github.com/ember-cli/ember-cli/pull/5274
    // this can be removed when we no longer support 2.2.0-beta.{1,2}
    this._shouldImportQUnit = !dep.gt('2.2.0-beta.2');

    this.setTestGenerator();
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  treeForAddonTestSupport: function() {
    return new MergeTrees(this._getDependencyTrees());
  },

  treeForVendor: function(tree) {
    var qunitPath = path.join(path.dirname(resolve.sync('qunitjs')), '..');

    var trees = [
      tree
    ];

    if (!this._shouldImportQUnit) {
      trees.push(this.treeGenerator(qunitPath));
    }

    if (this._shouldImportEmberQUnit) {
      // support for Ember CLI < 2.2.0-beta.1
      var depTree = new MergeTrees(this._getDependencyTrees());

      var transpiled = new BabelTranspiler(depTree, {
        loose: true,
        moduleIds: true,
        modules: 'amdStrict'
      });

      var concattedTree = new Concat(transpiled, {
        inputFiles: ['**/*.js'],
        outputFile: '/ember-qunit/ember-qunit.js',
        annotation: 'Concat: Ember QUnit'
      });

      trees.push(concattedTree);
    }

    return new MergeTrees(trees, {
      annotation: 'ember-cli-qunit: treeForVendor'
    });
  },

  included: function included(app, parentAddon) {
    var target = (parentAddon || app);
    this._super.included.call(this, target);

    this.options = target.options;

    var testSupportPath = target.options.outputPaths.testSupport.js;
    testSupportPath = testSupportPath.testSupport || testSupportPath;
    testSupportPath = path.dirname(testSupportPath) || 'assets';

    if (app.tests) {
      var fileAssets;

      if (this._shouldImportQUnit) {
        // ember-cli < 2.2.0-beta.3 gets this from bower
        fileAssets = [
          target.bowerDirectory + '/qunit/qunit/qunit.js',
          target.bowerDirectory + '/qunit/qunit/qunit.css'
        ];
      } else {
        fileAssets = [
          'vendor/qunit/qunit.js',
          'vendor/qunit/qunit.css'
        ];
      }


      var imgAssets = [];

      var qunitNotificationsPath = app.bowerDirectory + '/qunit-notifications/index.js';
      if (fs.existsSync(qunitNotificationsPath)) {
        fileAssets.push(qunitNotificationsPath);
        imgAssets.push(
          app.bowerDirectory + '/ember-qunit-notifications/passed.png',
          app.bowerDirectory + '/ember-qunit-notifications/failed.png'
        );
      }

      fileAssets.push(
        'vendor/ember-cli-qunit/qunit-configuration.js',
        'vendor/ember-cli-qunit/test-loader.js'
      );

      var addonOptions = target.options['ember-cli-qunit'];
      // Skip if disableContainerStyles === false.
      if (addonOptions && addonOptions.disableContainerStyles === false) {
        fileAssets.push('vendor/ember-cli-qunit/test-container-styles.css');
      }

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

      imgAssets.forEach(function(img){
        app.import(img, {
          type: 'test',
          destDir: testSupportPath
        });
      });
    }

    this.jshintrc = app.options.jshintrc;

    if (this._shouldImportEmberQUnit) {
      // support for Ember CLI < 2.2.0-beta.1
      app.import('vendor/ember-qunit/ember-qunit.js', { type: 'test' });
    }
  },

  contentFor: function(type) {
    // Skip if insertContentForTestBody === false.
    if (type === 'test-body' && !(this.options['ember-cli-qunit'] && this.options['ember-cli-qunit'].insertContentForTestBody === false)) {
      return this._readTemplate('test-body');
    }
  },

  _readTemplate: function(name) {
    return fs.readFileSync(path.join(__dirname, 'templates', name + '.html'));
  },

  setTestGenerator: function() {
    this.project.generateTestFile = function(moduleName, tests) {
      var output = "QUnit.module('" + moduleName + "');\n";

      tests.forEach(function(test) {
        output += "QUnit.test('" + test.name + "', function(assert) {\n";
        output += "  assert.expect(1);\n";
        output += "  assert.ok(" + test.passed + ", '" + test.errorMessage + "');\n";
        output += "});\n";
      });

      return output;
    };
  },

  lintTree: function(type, tree) {
    var project = this.project;

    var addonContext = this;
    var disableLinting = this.options['ember-cli-qunit'] && this.options['ember-cli-qunit'].useLintTree === false;
    var lintingAddonExists = project.addons.filter(function(addon) {
      return addonContext !== addon && addon.lintTree && addon.isDefaultJSLinter;
    }).length > 0;

    // Skip if useLintTree === false.
    if (disableLinting || lintingAddonExists) {
      // Fakes an empty broccoli tree
      return { inputTree: tree, rebuild: function() { return []; } };
    }

    return jshintTrees(tree, {
      jshintrcPath: this.jshintrc[type],
      description: 'JSHint ' +  type + '- QUnit',
      console: this.console,
      testGenerator: function(relativePath, passed, errors) {
        if (errors) {
          errors = "\\n" + this.escapeErrorString(errors);
        } else {
          errors = "";
        }

        return project.generateTestFile('JSHint - ' + relativePath, [{
          name: 'should pass jshint',
          passed: !!passed,
          errorMessage: relativePath + ' should pass jshint.' + errors
        }]);
      }
    });
  }
};
