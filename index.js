'use strict';

module.exports = {
  name: 'ember-cli-qunit',

  // intentionally not calling _super here
  // to avoid these trees being namespaced into
  // `ember-cli-qunit/test-support/`
  treeForAddonTestSupport: function(tree) {
    return this.preprocessJs(tree, {
      registry: this.registry
    });
  },
};
