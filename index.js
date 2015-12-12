'use strict';

var path = require('path');
var fs   = require('fs');
var resolve = require('resolve');
var jshintTrees = require('broccoli-jshint');
var MergeTrees = require('broccoli-merge-trees');


module.exports = {
  name: 'Ember CLI QUnit',

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
    this.buildConsole();
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  treeForAddonTestSupport: function() {
    var emberQUnitPath = path.dirname(resolve.sync('ember-qunit'));
    var emberTestHelpersPath = path.dirname(resolve.sync('ember-test-helpers', { basedir: emberQUnitPath }));
    var klassyPath = path.dirname(resolve.sync('klassy', { basedir: emberTestHelpersPath }));

    var tree = new MergeTrees([
      this.treeGenerator(emberQUnitPath),
      this.treeGenerator(emberTestHelpersPath),
      this.treeGenerator(klassyPath)
    ]);

    return tree;
  },

  included: function included(app, parentAddon) {
    var target = (parentAddon || app);
    this._super.included(target);

    this.options = target.options;

    var testSupportPath = target.options.outputPaths.testSupport.js;
    testSupportPath = testSupportPath.testSupport || testSupportPath;
    testSupportPath = path.dirname(testSupportPath) || 'assets';

    if (app.tests) {
      var fileAssets = [
        app.bowerDirectory + '/qunit/qunit/qunit.js',
        app.bowerDirectory + '/qunit/qunit/qunit.css'
      ];

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

  lintTree: function(type, tree) {
    // Skip if useLintTree === false.
    if (this.options['ember-cli-qunit'] && this.options['ember-cli-qunit'].useLintTree === false) {
      // Fakes an empty broccoli tree
      return { inputTree: tree, rebuild: function() { return []; } };
    }

    var ui = this.ui;

    return jshintTrees(tree, {
      jshintrcPath: this.jshintrc[type],
      description: 'JSHint ' +  type + '- QUnit',
      console: this.console
    });
  }
};
