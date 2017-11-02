var browser;

if (BROWSER == 'chrome') {
    browser = window.chrome;
}
else {
    browser = window.browser;
}

browser.browserAction.onClicked.addListener(function (tab) {
    browser.tabs.create({
        'url': browser.extension.getURL('dashboard.html')
    });
});
