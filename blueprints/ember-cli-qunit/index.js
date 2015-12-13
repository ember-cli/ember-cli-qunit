module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'ember-cli-test-loader',           target: '0.2.1'   },
      { name: 'ember-qunit-notifications',       target: '0.1.0'   }
    ]);
  }
};
