import Ember from 'ember';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance | Adapter');

test('starting and stoping async behavior works', function(assert) {
  assert.expect(2);

  visit('/');
  andThen(() => assert.ok(true));
  click('.other-page-link');
  andThen(() => assert.ok(true));
});
