var Chrome = function () {};

Chrome.get = function (callback) {
    chrome.storage.sync.get({
        'gitlab': '',
        'gitlabPrivateToken': '',
        'dashboardRefreshRate': 3,
        'projectsInfo': {},
    }, function (items) {
        callback(items);
    });
};

Chrome.set = function(gitlab, gitlabPrivateToken, dashboardRefreshRate, projectsInfo, callback) {
    chrome.storage.sync.set({
        'gitlab': gitlab,
        'gitlabPrivateToken': gitlabPrivateToken,
        'dashboardRefreshRate': dashboardRefreshRate,
        'projectsInfo': projectsInfo
    }, callback);
};

module.exports = Chrome;
