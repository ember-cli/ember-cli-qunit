'use strict';

module.exports = function(environment, config) {
  /*
  This is the configuration that we'll return back out for deep merging. It's a
  scaffold so that we don't have to create all of the nested objects.
  */  
  var ENV = { APP: { options: { 'ember-cli-qunit': {} } } };

  /*
  The existing configuration as it has been built up to this point is available
  in the `config` argument. We can inspect that to make programmatic changes to
  respond to configuration from the application as well as already-processed
  addons.

  If any previous addon or the host application has set a rootElement for
  ember-cli-qunit treat that as our configuration value. Otherwise, use the
  value from our local configuration.
  */
  var configRootElement;
  if (config && config.APP && config.APP.options && config.APP.options['ember-cli-qunit']) {
    configRootElement = config.APP.options['ember-cli-qunit'].rootElement;
  }

  if (!configRootElement) {
    // Set the default, make sure we pass it back out.
    configRootElement = '#ember-testing';
    ENV.APP.options['ember-cli-qunit'].rootElement = configRootElement
  }

  /*  
  If the existing configuration has already defined ENV.APP.rootElement then we
  won't clobber it. However, if that is undefined at this point, we'll set it to
  the value from our configuration.
  */
  var appRootElement;
  if (config && config.APP) {
    appRootElement = config.APP.rootElement;
  }

  if (environment === 'test' && !appRootElement) {
    ENV.APP.rootElement = configRootElement;
  }

  /*
  Whatever is returned from this function is deep-merged with what was passed
  in as the config argument. There's no need to modify the config in place.
  */
  return ENV;
};
