module.exports = function (analyticsService, $scope) {
    $scope.openSettings = function () {
        var browser;

        if (BROWSER == 'chrome') {
            browser = window.chrome;
        }
        else {
            browser = window.browser;
        }

        analyticsService.event('navbar', 'click', 'settings', 0);
        browser.runtime.openOptionsPage(function () { });
    };

    $scope.openFeedback = function () {
        var feedbackPage;

        if (BROWSER == 'chrome') {
            feedbackPage = 'https://chrome.google.com/webstore/detail/gitlab-dashboard/leppeleneeeiicclfofnahpncincelfi/reviews';
        }
        else {
            feedbackPage = 'https://addons.mozilla.org/en-US/firefox/addon/gitlab-dashboard/';
        }

        analyticsService.event('navbar', 'click', 'feedback', 0);
        window.open(feedbackPage);
    };

    analyticsService.load()
        .then(function () {
            analyticsService.pageview();
        });
};
