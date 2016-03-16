import { module, test } from 'qunit';

module('Unit | Utility | qunit configuration');

test('adds Disable Linting option to the toolbar', function(assert) {
  assert.equal($('#qunit-urlconfig-nolint').length, 1, "checkbox added");
  assert.equal($('label[for=qunit-urlconfig-nolint]').text(), "Disable Linting", "label added");
});
