module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    var addonContext = this;

    return this.addBowerPackageToProject('qunit', '~1.17.0')
      .then(function() {
        return addonContext.addBowerPackageToProject('ember-cli/ember-cli-shims', '0.0.3');
      })
      .then(function() {
        return addonContext.addBowerPackageToProject('ember-cli/ember-cli-test-loader', '0.1.0');
      })
      .then(function() {
        return addonContext.addBowerPackageToProject('ember-qunit-notifications', '0.0.5');
      })
      .then(function() {
        return addonContext.addBowerPackageToProject('ember-qunit', '0.1.8');
      });
  }
};
