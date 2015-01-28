/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoader = require('ember-cli/test-loader')['default'];
  TestLoader.prototype.shouldLoadModule = function(moduleName) {
    return moduleName.match(/[-_]test$/) || (!QUnit.urlParams.nojshint && moduleName.match(/\.jshint$/));
  };
  TestLoader.load();
});
