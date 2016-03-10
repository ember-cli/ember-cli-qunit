import { module, test } from 'qunit';

module('Unit | Utility | qunit configuration');

test('adds Disable Linting option to the toolbar', function(assert) {
  assert.equal($('#qunit-urlconfig-nojshint').length, 1, "checkbox added");
  assert.equal($('label[for=qunit-urlconfig-nojshint]').text(), "Disable JSHint", "label added");
});
