var _ = require('underscore');
var $ = require('jquery');
var ko = require('../../helpers/knockout.js');
var GitlabApi = require('../../models/gitlab_api.js');
var MergeRequest = require('../../models/merge_request.js');
var Pipeline = require('../../models/pipeline.js');
var Project = require('../../models/project.js');

function DashboardViewModel(gitlabApiEndpoint, gitlabPrivateToken, dashboardRefreshRate) {
    var self = this;
    var api = new GitlabApi(gitlabApiEndpoint, gitlabPrivateToken);

    self.projects = ko.observableArray([]);
    self.errors = ko.observableArray([]);

    Project.api = api;
    Project.viewModel = self;
    Pipeline.api = api;
    Pipeline.viewModel = self;
    MergeRequest.api = api;
    MergeRequest.viewModel = self;

    Project.loadAll();

    setInterval(function () {
        Project.updateAll();

        _.each(self.projects(), function (project) {
            Pipeline.load.call(project);
            MergeRequest.load.call(project);
        });
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
