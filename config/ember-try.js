/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'old-test-loader',
      bower: {
        dependencies: {
          'ember-cli-test-loader': '0.2.2'
        }
      }
    },
    {
      name: 'default',
      npm: {
        devDependencies: {
          'ember-cli-test-loader': '^2.2.0'
        }
      }
    },
    {
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release',
        },
        resolutions: {
          'ember': 'release'
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-test-loader': '^2.2.0'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta',
        },
        resolutions: {
          'ember': 'beta',
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-test-loader': '^2.2.0',
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary',
        },
        resolutions: {
          'ember': 'canary',
        }
      },
      npm: {
        devDependencies: {
          'ember-cli-test-loader': '^2.2.0',
        }
      }
    }
  ]
};
