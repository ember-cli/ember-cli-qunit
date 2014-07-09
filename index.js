'use strict';

var path      = require('path');
var fs        = require('fs');

function EmberCLIQUnit(project) {
  this.project = project;
  this.name    = 'Ember CLI QUnit';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIQUnit.prototype.treeFor = function treeFor(name) {
  if(name !== 'vendor') { return; }

  var treePath = path.join(__dirname, 'vendor');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIQUnit.prototype.included = function included(app) {
  if (app.tests) {
    var fileAssets = [
      'vendor/qunit/qunit/qunit.js',
      'vendor/qunit/qunit/qunit.css',
      'vendor/qunit-notifications/index.js',
    ];

    var imgAssets = [
      'vendor/ember-qunit-notifications/passed.png',
      'vendor/ember-qunit-notifications/failed.png',
    ];

    app.import('vendor/ember-qunit/dist/named-amd/main.js', {
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

    app.import('vendor/ember-cli-shims/test-shims.js', {
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
};

module.exports = EmberCLIQUnit;
