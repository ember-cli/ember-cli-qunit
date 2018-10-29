## ember-cli-qunit

**NOTE: This addon has been deprecated! Please use ember-qunit directly instead.**

### Migrating to `ember-qunit`

To upgrade from `ember-cli-qunit@4` to `ember-qunit@4` perform the following:

#### `yarn`

* `yarn remove ember-cli-qunit`
* `yarn add -D ember-qunit`
* Update `tests/test-helper.js` to replace any imports from `ember-cli-qunit` with an import from `ember-qunit`.

#### `npm`

* `npm uninstall --save-dev ember-cli-qunit`
* `npm install --save-dev ember-qunit`
* Update `tests/test-helper.js` to replace any imports from `ember-cli-qunit` with an import from `ember-qunit`.
