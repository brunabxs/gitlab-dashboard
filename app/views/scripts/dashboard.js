var _ = require('underscore');
var $ = require('jquery');
var ko = require('../../helpers/knockout.js');
var Chrome = require('../../models/chrome.js');
var GitlabApi = require('../../models/gitlab_api.js');
var MergeRequest = require('../../models/merge_request.js');
var Pipeline = require('../../models/pipeline.js');
var Project = require('../../models/project.js');

function DashboardViewModel(api, dashboardRefreshRate, projectsInfo) {
    var self = this;

    self.projects = ko.observableArray([]);
    self.visibleProjects = ko.pureComputed(function () {
        return _.filter(self.projects(), function (project) { return project.visible(); }); 
    });

    Project.api = api;
    Project.viewModel = self;
    Pipeline.api = api;
    Pipeline.viewModel = self;
    MergeRequest.api = api;
    MergeRequest.viewModel = self;

    Project.loadAll(projectsInfo);

    setInterval(function () {
        Project.updateAll();

        _.each(self.projects(), function (project) {
            if (project.visible()) {
                Pipeline.load.call(project);
                MergeRequest.load.call(project);
            }
        });
    }, dashboardRefreshRate * 1000);
}

$(document).ready(function () {
    Chrome.get(function (items) {
        ko.applyBindings(new DashboardViewModel(new GitlabApi(items.gitlab, items.gitlabPrivateToken), items.dashboardRefreshRate, items.projectsInfo));
    });
});
