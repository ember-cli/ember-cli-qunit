'use strict';
/* eslint-env node */

module.exports = {
  name: 'ember-cli-qunit',

  contentFor(type) {
    let output = this.eachAddonInvoke('contentFor', [type]);
    return output.join('\n');
  },

  // intentionally not calling _super here
  // to avoid these trees being namespaced into
  // `ember-cli-qunit/test-support/`
  treeForAddonTestSupport: function(tree) {
    return this.preprocessJs(tree, {
      registry: this.registry,
    });
  },
};
