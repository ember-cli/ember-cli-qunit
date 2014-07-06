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
  this.app = app;

  if (this.app.tests) {
    this.app.import('vendor/qunit/qunit/qunit.js', {
      type: 'test'
    });
    this.app.import('vendor/qunit/qunit/qunit.css', {
      type: 'test'
    });
    this.app.import('vendor/qunit-notifications/index.js', {
      type: 'test'
    });
    this.app.import('vendor/ember-cli-test-loader/test-loader.js', {
      type: 'test'
    });
  }
};

module.exports = EmberCLIQUnit;
