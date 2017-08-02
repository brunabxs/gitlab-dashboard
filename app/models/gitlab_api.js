var $ = require('jquery');
var Promise = require('bluebird');

var GitlabApi = function (gitlabApiEndpoint, gitlabPrivateToken) {
    var self = this;

    self.gitlabApiEndpoint = gitlabApiEndpoint;
    self.gitlabPrivateToken = gitlabPrivateToken;
};

GitlabApi.prototype.getResource = function (resource) {
    var self = this;
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: self.gitlabApiEndpoint + resource,
            headers: {
                'PRIVATE-TOKEN': self.gitlabPrivateToken
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

GitlabApi.prototype.getProjects = function () {
    var self = this;
    return self.getResource('/projects?membership=true');
};

GitlabApi.prototype.getRecentPipeline = function (projectId) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.getResource('/projects/' + projectId + '/pipelines?ref=master&sort=desc')
            .then(function (pipelines) {
                var pipeline = undefined;
                if (pipelines && pipelines.length > 0) {
                    return self.getResource('/projects/' + projectId + '/pipelines/' + pipelines[0].id);
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

GitlabApi.prototype.getRecentJobWithScope = function (projectId, pipelineId, jobScope) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.getResource('/projects/' + projectId + '/pipelines/' + pipelineId + '/jobs?scope[]=' + jobScope)
            .then(function (jobs) {
                var job = undefined;
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

GitlabApi.prototype.getOpenedMergeRequests = function (projectId) {
    var self = this;
    return self.getResource('/projects/' + projectId + '/merge_requests?state=opened');
};

module.exports = GitlabApi;
