var _ = require('underscore');
var ko = require('../helpers/knockout.js');
var MergeRequest = require('./merge_request.js');
var Pipeline = require('./pipeline.js');

var Project = function (id, name, branch, url) {
    var self = this;

    self.id = id;
    self.name = name;
    self.branch = branch;
    self.url = url;
    self.pipeline = ko.onDemandObservable(Pipeline.load, self);
    self.mergeRequests = ko.onDemandObservableArray(MergeRequest.load, self);
    self.visible = ko.observable(true);

    self.status = ko.pureComputed(function () {
        if (self.pipeline())
            return self.pipeline().status;
        return 'unavailable';
    });

    self.identifier = ko.pureComputed(function () {
        return self.id + '#' + self.branch;
    });
};

Project.viewModel = undefined;
Project.api = undefined;

Project.loadAll = function (projectsInfo) {
    var self = this;

    Project.api.getProjects()
        .then(function (data) {
            _.each(data, function (raw_project) {
                Project.api.getBranches(raw_project.id)
                    .then(function (data_branches) {
                        _.each(data_branches, function (raw_branch) {
                            var project = new Project(raw_project.id, raw_project.name_with_namespace, raw_branch.name, raw_project.web_url);
                            if (projectsInfo[project.identifier()]) {
                                project.visible(projectsInfo[project.identifier()].visible);
                            }
                            Project.viewModel.projects.push(project);
                        });
                        return null;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return null;
                    });
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
    var oldProjectIds = new Set();

    Project.api.getProjects()
        .then(function (data) {
            _.each(Project.viewModel.projects(), function (project) {
                oldProjectIds.add(project.identifier());
            });

            var promises = [];
            _.each(data, function (raw_project) {
                promise = Project.api.getBranches(raw_project.id)
                    .then(function (data_branches) {
                        _.each(data_branches, function (raw_branch) {
                            var project = new Project(raw_project.id, raw_project.name_with_namespace, raw_branch.name, raw_project.web_url);
                            if (oldProjectIds.has(project.identifier())) {
                                oldProjectIds.delete(project.identifier());
                            }
                            else {
                                Project.viewModel.projects.push(project);
                            }
                        });
                        return Promise.resolve();
                    });
                promises.push(promise);
            });
            return Promise.all(promises);
        })
        .then(function () {
            Project.viewModel.projects.remove(function (project) {
                return oldProjectIds.has(project.identifier());
            });
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
};

module.exports = Project;
