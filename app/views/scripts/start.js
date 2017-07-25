chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('dashboard.html')
    }, function (tab) {

    });
});
