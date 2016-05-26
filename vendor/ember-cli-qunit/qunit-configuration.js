/* globals jQuery,QUnit */

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
QUnit.config.urlConfig.push({ id: 'nolint', label: 'Disable Linting'});
QUnit.config.urlConfig.push({ id: 'dockcontainer', label: 'Dock container'});
QUnit.config.urlConfig.push({ id: 'devmode', label: 'Development mode' });

QUnit.config.testTimeout = QUnit.urlParams.devmode ? null : 60000; //Default Test Timeout 60 Seconds

if (QUnit.notifications) {
  QUnit.notifications({
    icons: {
      passed: '/assets/passed.png',
      failed: '/assets/failed.png'
    }
  });
}

jQuery(document).ready(function() {
  var testContainer = document.getElementById('ember-testing-container');
  if (!testContainer) { return; }

  var params = QUnit.urlParams;

  var containerVisibility = params.nocontainer ? 'hidden' : 'visible';
  var containerPosition = (params.dockcontainer || params.devmode) ? 'absolute' : 'relative';

  if (params.devmode) {
    testContainer.className = ' full-screen';
  }

  testContainer.style.visibility = containerVisibility;
  testContainer.style.position = containerPosition;
});
