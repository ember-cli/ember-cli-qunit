/* globals jQuery,QUnit */

jQuery(window).on('load', function() {
  var TestLoader = require('ember-cli/test-loader')['default'];
  TestLoader.prototype.shouldLoadModule = function(moduleName) {
    return moduleName.match(/[-_]test$/) || (!QUnit.urlParams.nojshint && moduleName.match(/\.jshint$/));
  };

  setTimeout(function() {
    TestLoader.load();
    QUnit.start();
  }, 250);
});
