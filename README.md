## ember-cli-qunit

This addon that adds `QUnit` to the generated Ember CLI test output (in `test-vendor.js`).

### Installation / Usage

From within your Ember CLI application (must be > 0.0.42), run the following:

```bash
ember install ember-cli-qunit
```

### Upgrading

```bash
ember generate ember-cli-qunit
```

### Turning off JSHint linting

If you want to turn off JSHint linting you can do the following configuration in your `ember-cli-build.js` file:

```
var app = new EmberApp({
  'babel': {
    optional: ['es7.decorators']
  },

  'ember-cli-qunit': {
    useLintTree: false
  }
});
```

### References

* [qunit](https://github.com/jquery/qunit)
