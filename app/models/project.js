var _ = require('underscore');
var ko = require('knockout');
var MergeRequest = require('./merge_request.js');
var Pipeline = require('./pipeline.js');

var Project = function (id, name, url) {
    var self = this;

    self.id = id;
    self.name = name;
    self.url = url;
    self.pipeline = ko.observable();
    self.mergeRequests = ko.observableArray([]);

    self.status = ko.pureComputed(function () {
        if (self.pipeline())
            return self.pipeline().status;
        return 'unavailable';
    });
};

Project.loadAll = function (gitlabApi, dashboard) {
    var self = this;
    gitlabApi.getResource('/projects?membership=true')
        .then(function (data) {
            dashboard.projects(_.map(data, function (project) {
                return new Project(project.id, project.name, project.web_url);
            }));

            MergeRequest.loadAll(gitlabApi, dashboard);
            Pipeline.loadAll(gitlabApi, dashboard);
            return null;
        })
        .catch(function (error) {
            dashboard.errors.push(error);
            return null;
        });
};

Project.updateAll = function (gitlabApi, dashboard) {
    var self = this;
    gitlabApi.getResource('/projects?membership=true')
        .then(function (data) {
            var projectNames = new Set();
            _.each(dashboard.projects(), function (project) {
                projectNames.add(project.name);
            });

            _.each(data, function (project) {
                if (!projectNames.has(project.name)) {
                    dashboard.projects.push(new Project(project.id, project.name, project.web_url));
                }
            });

            // TODO: remove projects from dashboard that no longer exists

            MergeRequest.updateAll(gitlabApi, dashboard);
            Pipeline.updateAll(gitlabApi, dashboard);
            return null;
        })
        .catch(function (error) {
            dashboard.errors.push(error);
            return null;
        });
};

module.exports = Project;
