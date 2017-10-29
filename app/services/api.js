var _ = require('underscore');
var Promise = require('bluebird');

var GitlabApi = require('../models/gitlab_api.js');
var MergeRequest = require('../models/merge_request.js');
var Pipeline = require('../models/pipeline.js');
var Project = require('../models/project.js');

module.exports = function (log, storage, $interval) {
    var _this = this;

    this.api = undefined;
    this.projects = [];
    this.projectsSettings = undefined;

    this.isReady = function () {
        return _this.api !== undefined;
    };

    this.save = function () {
        var settings = {};
        _.each(_this.projects, function (project) {
            settings[project.identifier()] = {
                visible: project.visible
            };
        });

        storage.saveApiConfig(_this.api.endpoint, _this.api.token, settings)
            .then(function (config) {
                log.debug('[Service - Api]', 'Configurations successfully saved');
            })
            .catch(function (error) {
                log.error('[Service - Api]', 'Error occurred while saving configurations', error);
            });
    };

    var load = function () {
        storage.getApiConfig()
            .then(function (config) {
                _this.api = new GitlabApi(config.endpoint, config.token);
                _this.projectsSettings = config.projects_settings;
                log.debug('[Service - Api]', 'Configurations successfully retrieved');
            })
            .catch(function (error) {
                log.error('[Service - Api]', 'Error occurred while retrieving configurations', error);
            });
    };

    load();

    var addProject = function (project) {
        var projectSettings = _this.projectsSettings[project.identifier()];
        if (projectSettings) {
            project.visible = projectSettings.visible;
        }
        _this.projects.push(project);
    };

    var removeProject = function (project) {
        index = _.findWhere(_this.projects, project);
        _this.projects.splice(index, 1);
    };

    this.loadProjects = function () {
        var oldProjectIds = new Set();
        _.each(_this.projects, function (project) {
            oldProjectIds.add(project.identifier());
        });

        return new Promise(function (resolve, reject) {
            promises = _this.api.getProjects()
                .each(function (rawProject) {
                    project_promise = Promise.resolve(rawProject);
                    branches_promise = _this.api.getBranches(rawProject.id);
                    return Promise.join(project_promise, branches_promise, function (rawProject, rawBranches) {
                        _.each(rawBranches, function (rawBranch) {
                            var project = new Project(rawProject.id, rawProject.name_with_namespace, rawBranch.name, rawProject.web_url);

                            if (oldProjectIds.has(project.identifier())) {
                                oldProjectIds.delete(project.identifier());
                            }
                            else {
                                addProject(project);
                            }
                        });
                        return Promise.resolve();
                    });
                });

            Promise.all(promises)
                .then(function () {
                    var projects = _.map(_this.projects, function (project) { return project; });
                    _.each(projects, function (project) {
                        if (oldProjectIds.has(project.identifier())) {
                            removeProject(project);
                        }
                    });
                    resolve();
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    };

    this.loadPipeline = function (project) {
        return new Promise(function (resolve, reject) {
            _this.api.getRecentPipeline(project.id, project.branch)
                .then(function (pipeline) {
                    if (pipeline) {
                        return _this.api.getRecentJobWithScope(project.id, pipeline.id, pipeline.status);
                    }
                    return Promise.resolve();
                })
                .then(function (job) {
                    var pipeline;
                    if (job) {
                        pipeline = new Pipeline(job.pipeline.id, job.stage, job.pipeline.status, job.pipeline.ref, job.commit.short_id, '');
                    }
                    resolve(pipeline);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    };

    this.loadMergeRequests = function (project) {
        return new Promise(function (resolve, reject) {
            _this.api.getOpenedMergeRequests(project.id, project.branch)
                .then(function (rawMergeRequests) {
                    var mergeRequests = _.map(rawMergeRequests, function (mergeRequest) {
                        return new MergeRequest(mergeRequest.id, mergeRequest.target_branch, mergeRequest.source_branch, mergeRequest.upvotes,
                            mergeRequest.downvotes, mergeRequest.web_url);
                    });
                    resolve(mergeRequests);
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    };
};
