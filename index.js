'use strict';

var path = require('path');
var fs   = require('fs');
var resolve = require('resolve');

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

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    var VersionChecker = require('ember-cli-version-checker');
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
    var MergeTrees = require('broccoli-merge-trees');
    return new MergeTrees(this._getDependencyTrees());
  },

  treeForVendor: function(tree) {
    var MergeTrees = require('broccoli-merge-trees');
    var qunitPath = path.join(path.dirname(resolve.sync('qunitjs')), '..');

    var trees = [
      tree,
      this._notificationsTree()
    ];

    if (!this._shouldImportQUnit) {
      trees.push(this.treeGenerator(qunitPath));
    }

    if (this._shouldImportEmberQUnit) {
      // support for Ember CLI < 2.2.0-beta.1
      var depTree = new MergeTrees(this._getDependencyTrees());

      var BabelTranspiler = require('broccoli-babel-transpiler');
      var transpiled = new BabelTranspiler(depTree, {
        loose: true,
        moduleIds: true,
        modules: 'amdStrict'
      });

      var Concat = require('broccoli-concat');
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

      fileAssets.push(
        'vendor/qunit-notifications/index.js',
        'vendor/ember-cli-qunit/qunit-configuration.js',
        'vendor/ember-cli-qunit/test-loader.js'
      );

      var addonOptions = target.options['ember-cli-qunit'];
      var hasAddonOptions = !!addonOptions;
      var explicitlyDisabledContainerStyles = hasAddonOptions && addonOptions.disableContainerStyles === true;
      if (!explicitlyDisabledContainerStyles) {
        fileAssets.push('vendor/ember-cli-qunit/test-container-styles.css');
      }

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

      var imgAssets = [
        'vendor/ember-cli-qunit/images/passed.png',
        'vendor/ember-cli-qunit/images/failed.png'
      ];

      imgAssets.forEach(function(img) {
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

  _notificationsTree: function() {
    var Funnel = require('broccoli-funnel');
    var notificationsPath = path.dirname(resolve.sync('qunit-notifications'));
    return new Funnel(notificationsPath, {
      include: [ 'index.js' ],
      destDir: 'qunit-notifications',
      annotation: 'qunit-notifications'
    });
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
  }
};
