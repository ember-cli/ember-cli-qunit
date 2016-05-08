/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'default',
      bower: {
        dependencies: {
          'ember-cli-test-loader': '0.2.2'
        }
      }
    },
    {
      name: 'old-test-loader',
      bower: {
        dependencies: {
          'ember-cli-test-loader': '0.2.0'
        }
      }
    },
    {
      name: 'npm-test-loader',
      npm: {
        devDependencies: {
          'ember-cli': 'ember-cli/ember-cli',
          'ember-cli-test-loader': '^1.1.0'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release',
          'ember-cli-test-loader': '0.2.2'
        },
        resolutions: {
          'ember': 'release'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta',
          'ember-cli-test-loader': '0.2.2'
        },
        resolutions: {
          'ember': 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary',
          'ember-cli-test-loader': '0.2.2'
        },
        resolutions: {
          'ember': 'canary'
        }
      }
    }
  ]
};
