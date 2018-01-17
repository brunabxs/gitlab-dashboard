var LegacyStorageProvider = require('../../providers/legacy_storage.js');
var StorageProvider = require('../../providers/storage.js');

var UpdateLegacyStorageInstallation = require('../../installation/update_legacy_storage.js');

var browser;
if (BROWSER == 'chrome') {
    browser = window.chrome;
}
else {
    browser = window.browser;
}

browser.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'update' && details.previousVersion < '1.1.1') {
        new UpdateLegacyStorageInstallation().update(new StorageProvider(), new LegacyStorageProvider());
    }
});

browser.browserAction.onClicked.addListener(function (tab) {
    browser.tabs.create({
        'url': browser.extension.getURL('dashboard.html')
    });
});
