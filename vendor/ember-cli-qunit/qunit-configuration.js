/* globals jQuery,QUnit */

QUnit.config.autostart = false;
QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container' });
QUnit.config.urlConfig.push({ id: 'nojshint', label: 'Disable JSHint'});

if (QUnit.notifications) {
  QUnit.notifications({
    icons: {
      passed: '/assets/passed.png',
      failed: '/assets/failed.png'
    }
  });
}

jQuery(document).ready(function() {
  if(QUnit.urlParams.nocontainer) {
    document.getElementById('ember-testing-container').style.visibility = 'hidden';
    document.getElementById('qunit').style.width = "100%";
  }

  var appContainer = document.getElementById('ember-testing-container').contentWindow.document;
  // Copy the head of the main test html file to the iFrame to get stylesheets
  appContainer.head.innerHTML = document.head.innerHTML;

  appContainer.body.style.zoom = "50%";
});
