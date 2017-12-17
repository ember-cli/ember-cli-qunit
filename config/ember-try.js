/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'old-test-loader',
      bower: {
        dependencies: {
          'ember-cli-test-loader': '0.2.2'
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-test-loader': null
        }
      }
     },
    {
      name: 'default',
    }
  ]
};
