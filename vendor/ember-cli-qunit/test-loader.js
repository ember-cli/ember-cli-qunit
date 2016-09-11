/* globals jQuery, QUnit, require, requirejs */

(function() {
  function ready(fn) {
    if (typeof jQuery === 'function') {
      jQuery(document).ready(fn);
      return;
    }

    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  var autostart = QUnit.config.autostart !== false;
  QUnit.config.autostart = false;

  ready(function() {
    var QUnitAdapter = require('ember-qunit').QUnitAdapter;
    Ember.Test.adapter = QUnitAdapter.create();

    var testLoaderModulePath = 'ember-cli-test-loader/test-support/index';

    if (!requirejs.entries[testLoaderModulePath]) {
      testLoaderModulePath = 'ember-cli/test-loader';
    }

    var TestLoaderModule = require(testLoaderModulePath);
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
      TestLoader.prototype.shouldLoadModule = function shouldLoadModule(moduleName) {
        return (moduleName.match(/[-_]test$/) || includeModule(moduleName)) && !excludeModule(moduleName);
      };
    }

    var moduleLoadFailures = [];

    TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
      moduleLoadFailures.push(error);

      QUnit.module('TestLoader Failures');
      QUnit.test(moduleName + ': could not be loaded', function() {
        throw error;
      });
    };

    QUnit.done(function() {
      if (moduleLoadFailures.length) {
        throw new Error('\n' + moduleLoadFailures.join('\n'));
      }
    });

    setTimeout(function() {
      TestLoader.load();

      if (autostart) {
        QUnit.start();
      }
    }, 250);
  });

})();
