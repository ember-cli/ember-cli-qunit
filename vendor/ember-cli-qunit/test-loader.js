/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoaderModule = require('ember-cli/test-loader');
  var TestLoader = TestLoaderModule['default'];
  var addModuleExcludeMatcher = TestLoaderModule['addModuleExcludeMatcher'];
  var addModuleIncludeMatcher = TestLoaderModule['addModuleIncludeMatcher'];

  function excludeModule(moduleName) {
    return QUnit.urlParams.nolint &&
           moduleName.match(/\.(jshint|lint-test)$/);
  }

  function includeModule(moduleName) {
    return moduleName.match(/\.jshint$/);
  }

  if (addModuleExcludeMatcher && addModuleIncludeMatcher) {
    addModuleExcludeMatcher(excludeModule);
    addModuleIncludeMatcher(includeModule);
  } else {
    throw new Error("You must upgrade your version of ember-cli-test-loader to 1.0.0 to use this version of ember-cli-qunit")
  }

  TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function() {
      throw error;
    });
  };

  var autostart = QUnit.config.autostart !== false;
  QUnit.config.autostart = false;

  setTimeout(function() {
    TestLoader.load();

    if (autostart) {
      QUnit.start();
    }
  }, 250);
});
