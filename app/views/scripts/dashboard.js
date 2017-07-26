var $ = require('jquery');
var ko = require('../../helpers/knockout.js');
var GitlabApi = require('../../models/gitlab_api.js');
var Project = require('../../models/project.js');

function DashboardViewModel(gitlabApiEndpoint, gitlabPrivateToken, dashboardRefreshRate) {
    var self = this;

    self.api = new GitlabApi(gitlabApiEndpoint, gitlabPrivateToken);
    self.projects = ko.observableArray([]);
    self.errors = ko.observableArray([]);

    Project.loadAll(self.api, self);

    setInterval(function () {
        Project.updateAll(self.api, self);
    }, dashboardRefreshRate * 1000);
}

$(document).ready(function () {
    chrome.storage.sync.get({
        'gitlab': '',
        'gitlabPrivateToken': '',
        'dashboardRefreshRate': 3
    }, function (items) {
        ko.applyBindings(new DashboardViewModel(items.gitlab, items.gitlabPrivateToken, items.dashboardRefreshRate));
    });
});
