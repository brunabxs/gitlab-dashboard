var $ = require('jquery');
var _ = require('underscore');
var Promise = require('bluebird');

module.exports = function (endpoint, token) {
    var _this = this;

    this.endpoint = endpoint;
    this.token = token;

    var getResource = function(resource) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: _this.endpoint + resource,
                headers: {
                    'PRIVATE-TOKEN': _this.token
                },
            })
                .done(function (data, textStatus, jqXHR) {
                    resolve(data);
                    return null;
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    // TODO: return a better error
                    reject(new Error(textStatus));
                    return null;
                });
        });
    };

    this.getProjects = function() {
        var projects = [];

        return new Promise(function (resolve, reject) {
            getResource('/projects?visibility=public&membership=true')
                .then(function (data) {
                    projects = projects.concat(data || []);
                    return getResource('/projects?visibility=private&membership=true');
                })
                .then(function (data) {
                    projects = projects.concat(data || []);
                    return getResource('/projects?visibility=internal&membership=true');
                })
                .then(function (data) {
                    projects = projects.concat(data || []);
                    resolve(projects);
                    return null;
                })
                .catch(function (error) {
                    reject(new Error(error));
                    return null;
                });
        });
    };

    this.getBranches = function(projectId) {
        return getResource('/projects/' + projectId + '/repository/branches');
    };

    this.getRecentPipeline = function(projectId, branch) {
        return new Promise(function (resolve, reject) {
            getResource('/projects/' + projectId + '/pipelines?ref=' + branch + '&sort=desc')
                .then(function (pipelines) {
                    var pipeline;
                    if (pipelines && pipelines.length > 0) {
                        return getResource('/projects/' + projectId + '/pipelines/' + pipelines[0].id);
                    }
                    return Promise.resolve();
                })
                .then(function (pipeline) {
                    resolve(pipeline);
                    return null;
                })
                .catch(function (error) {
                    reject(new Error(error));
                    return null;
                });
        });
    };

    this.getRecentJobWithScope = function(projectId, pipelineId, jobScope) {
        return new Promise(function (resolve, reject) {
            getResource('/projects/' + projectId + '/pipelines/' + pipelineId + '/jobs?scope[]=' + jobScope)
                .then(function (jobs) {
                    var job;
                    if (jobs && jobs.length > 0) {
                        jobs = jobs.sort(function (jobLeft, jobRight) {
                            return new Date(jobRight.started_at) - new Date(jobLeft.started_at);
                        });
                        job = jobs[0];
                    }
                    resolve(job);
                    return null;
                })
                .catch(function (error) {
                    reject(new Error(error));
                    return null;
                });
        });
    };

    this.getOpenedMergeRequests = function(projectId, branch) {
        return new Promise(function (resolve, reject) {
            return getResource('/projects/' + projectId + '/merge_requests?state=opened')
                .then(function (mergeRequests) {
                    resolve(_.filter(mergeRequests, function (mergeRequest) {
                        return mergeRequest.source_branch == branch;
                    }));
                    return null;
                })
                .catch(function (error) {
                    reject(new Error(error));
                    return null;
                });
        });
    };
};
