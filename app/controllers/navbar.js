var jquery = require('jquery');

var Analytics = require('../models/analytics.js');

module.exports = function ($scope) {
    var ga = new Analytics(GA_ID, BROWSER, VERSION, '/dashboard');

    $scope.openSettings = function () {
        var browser;

        if (BROWSER == 'chrome') {
            browser = window.chrome;
        }
        else {
            browser = window.browser;
        }

        ga.event('navbar', 'click', 'settings', 0);
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

        ga.event('navbar', 'click', 'feedback', 0);
        window.open(feedbackPage);
    };
};
