'use strict';

var path = require('path');

module.exports = {
  name: 'Ember CLI QUnit',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function included(app) {
    this._super.included(app);

    if (app.tests) {
      var fileAssets = [
        'bower_components/qunit/qunit/qunit.js',
        'bower_components/qunit/qunit/qunit.css',
        'bower_components/qunit-notifications/index.js',
      ];

      var imgAssets = [
        'bower_components/ember-qunit-notifications/passed.png',
        'bower_components/ember-qunit-notifications/failed.png',
      ];

      app.import('bower_components/ember-qunit/dist/named-amd/main.js', {
        type: 'test',
        exports: {
          'ember-qunit': [
            'globalize',
            'moduleFor',
            'moduleForComponent',
            'moduleForModel',
            'test',
            'setResolver'
          ]
        }
      });

      app.import('bower_components/ember-cli-shims/test-shims.js', {
        type: 'test',
        exports: {
          'qunit': ['default']
        }
      });

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

      imgAssets.forEach(function(img){
        app.import(img, {
          type: 'test',
          destDir: 'assets'
        });
      });
    }
  }
};
