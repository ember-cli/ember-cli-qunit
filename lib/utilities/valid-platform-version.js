'use strict';

var semver = require('semver');

module.exports = function(version) {

  return semver.satisfies(version, '^1.0.0') || // io.js
         semver.satisfies(version, '^0.12.0'); // node 0.12.x
};
