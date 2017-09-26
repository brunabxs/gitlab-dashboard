var _ = require('underscore');
var ko = require('../helpers/knockout.js');
var MergeRequest = require('./merge_request.js');
var Pipeline = require('./pipeline.js');

var Project = function (id, name, url) {
    var self = this;

    self.id = id;
    self.name = name;
    self.url = url;
    self.pipeline = ko.onDemandObservable(Pipeline.load, self);
    self.mergeRequests = ko.onDemandObservableArray(MergeRequest.load, self);
    self.visible = ko.observable(true);

    self.status = ko.pureComputed(function () {
        if (self.pipeline())
            return self.pipeline().status;
        return 'unavailable';
    });
};

Project.viewModel = undefined;
Project.api = undefined;

Project.loadAll = function (projectsInfo) {
    var self = this;

    Project.api.getProjects()
        .then(function (data) {
            Project.viewModel.projects(_.map(data, function (project) {
                return new Project(project.id, project.name_with_namespace, project.web_url);
            }));

            if (projectsInfo) {
                _.each(Project.viewModel.projects(), function (project) {
                    project.visible(projectsInfo[project.id].visible);
                });
            }

            Project.viewModel.projects().sort(function (left, right) {
                return left.name < right.name ? -1 : 1;
            });
            return null;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
};

Project.updateAll = function () {
    var self = this;

    Project.api.getProjects()
        .then(function (data) {
            var oldProjectIds = new Set();
            _.each(Project.viewModel.projects(), function (project) {
                oldProjectIds.add(project.id);
            });

            var newProjectIds = new Set();
            _.each(data, function (project) {
                if (!oldProjectIds.has(project.id)) {
                    Project.viewModel.projects.push(new Project(project.id, project.name_with_namespace, project.web_url));
                }
                newProjectIds.add(project.id);
            });

            Project.viewModel.projects.remove(function (project) {
                return !newProjectIds.has(project.id);
            });

            return null;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
};

module.exports = Project;
