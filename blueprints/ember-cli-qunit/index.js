var RSVP = require('rsvp');

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('ember-qunit-notifications', '0.1.0').then(function() {
      return this.addPackageToProject('ember-cli-test-loader', '^1.1.0');
    });
  }
};
