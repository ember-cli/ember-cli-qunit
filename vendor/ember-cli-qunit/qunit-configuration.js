/* globals jQuery,QUnit */

QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
QUnit.config.urlConfig.push({ id: 'nojshint', label: 'Disable JSHint'});
QUnit.config.urlConfig.push({ id: 'dockcontainer', label: 'Dock container'});
QUnit.config.testTimeout = 60000; //Default Test Timeout 60 Seconds

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

  var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
  var containerPosition = QUnit.urlParams.dockcontainer ? 'absolute' : 'relative';
  testContainer.style.visibility = containerVisibility;
  testContainer.style.position = containerPosition;
});
