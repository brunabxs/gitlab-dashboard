var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request-promise');

var Log = require('./log.js');
var OnDemandArray = require('./on_demand_array.js');
var Project = require('./project.js');
var Vcs = require('./vcs.js');

var GitlabVcs = function (name, endpoint, token, projectsSettings) {
    this.type = 'gitlab';
    this.name = name;
    this.endpoint = endpoint;
    this.token = token;

    Vcs.call(this, projectsSettings);
};

GitlabVcs.prototype = Object.create(Vcs.prototype);
GitlabVcs.prototype.constructor = GitlabVcs;

GitlabVcs.prototype.getResponse = function (path, method) {
    var self = this;

    var httpAction;
    
    method = method || 'GET';
    method = method.toLowerCase();
    if (method == 'get') {
        httpAction = request.get;
    }
    else if (method == 'head') {
        httpAction = request.head;
    }
    else if (method == 'post') {
        httpAction = request.post;
    }

    return new Promise(function (resolve, reject) {
        httpAction({
            uri: self.endpoint + path,
            resolveWithFullResponse: true,
            headers: {
                'PRIVATE-TOKEN': self.token
            },
        })
            .then(function (response) {
                resolve(response);
                return null;
            })
            .catch(function (error) {
                // TODO (brunabxs): return a better error
                reject(error);
                return null;
            });
    });
};

GitlabVcs.prototype.getResponsesFromMultiplePages = function (path) {
    var self = this;

    var responses = [];
    return new Promise(function (resolve, reject) {
        self.getResponse(path, 'HEAD')
            .then(function (response) {
                var promises = [];
                var totalPages = response.headers['x-total-pages'];
                for (var page = 1; page <= totalPages; ++page) {
                    promises.push(self.getResponse(path + (path.indexOf('?') > 0 ? '&' : '?') + 'page=' + page));
                }
                return Promise.all(promises);
            })
            .then(function (responses) {
                resolve(responses);
                return null;
            })
            .catch(function (error) {
                reject(error);
                return null;
            });
    });
};

GitlabVcs.prototype.serialize = function () {
    var self = this;

    return {
        type: self.type,
        name: self.name,
        settings: {
            endpoint: self.endpoint,
            token: self.token,
        },
        projects: self.projects.serialize()
    };
};

GitlabVcs.prototype.getProjects = function (visibility) {
    var self = this;

    var projects = [];
    return new Promise(function (resolve, reject) {
        self.getProjectsWithVisibility('public')
            .then(function (data) {
                projects = projects.concat(data);
                return self.getProjectsWithVisibility('internal');
            })
            .then(function (data) {
                projects = projects.concat(data);
                return self.getProjectsWithVisibility('private');
            })
            .then(function (data) {
                projects = projects.concat(data);
                resolve(projects);
                return null;
            })
            .catch(function (error) {
                reject(error);
                return null;
            });
    });
};

GitlabVcs.prototype.getProjectsWithVisibility = function (visibility) {
    var self = this;

    var projects = [];
    return new Promise(function (resolve, reject) {
        self.getResponsesFromMultiplePages('/projects?visibility=' + visibility + '&membership=true')
            .then(function (responses) {
                _.each(responses, function (response) {
                    projects = projects.concat(JSON.parse(response.body) || []);
                });
                resolve(projects);
                return null;
            })
            .catch(function (error) {
                reject(error);
                return null;
            });
    });
};

GitlabVcs.prototype.getBranches = function (projectId) {
    var self = this;

    var branches = [];
    return new Promise(function (resolve, reject) {
        self.getResponsesFromMultiplePages('/projects/' + projectId + '/repository/branches')
            .then(function (responses) {
                _.each(responses, function (response) {
                    branches = branches.concat(JSON.parse(response.body) || []);
                });
                resolve(branches);
                return null;
            })
            .catch(function (error) {
                reject(error);
                return null;
            });
    });
};

GitlabVcs.prototype.getRecentPipeline = function (projectId, branchId) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.getResponse('/projects/' + projectId + '/pipelines?ref=' + branchId + '&sort=desc&per_page=1')
            .then(function (response) {
                var pipelines = JSON.parse(response.body) || [];
                if (pipelines.length > 0) {
                    return self.getResponse('/projects/' + projectId + '/pipelines/' + pipelines[0].id);
                }
                return Promise.resolve();
            })
            .then(function (response) {
                resolve(response === undefined ? response : JSON.parse(response.body));
                return null;
            })
            .catch(function (error) {
                reject(new Error(error));
                return null;
            });
    });
};

GitlabVcs.prototype.getRecentJob = function (projectId, pipelineId, pipelineStatus) {
    var self = this;

    // TODO (brunabxs): retrieve from multiple pages
    return new Promise(function (resolve, reject) {
        self.getResponse('/projects/' + projectId + '/pipelines/' + pipelineId + '/jobs?scope[]=' + pipelineStatus)
            .then(function (response) {
                var jobs = JSON.parse(response.body) || [];
                jobs = jobs.sort(function (jobLeft, jobRight) {
                    return new Date(jobRight.started_at) - new Date(jobLeft.started_at);
                });
                resolve(jobs.length > 0 ? jobs[0] : undefined);
                return null;
            })
            .catch(function (error) {
                reject(new Error(error));
                return null;
            });
    });
};

GitlabVcs.prototype.getOpenedMergeRequests = function (projectId, sourceBranchId, targetBranchId) {
    var self = this;

    // TODO (brunabxs): retrieve from multiple pages
    return new Promise(function (resolve, reject) {
        self.getResponse('/projects/' + projectId + '/merge_requests?state=opened')
            .then(function (response) {
                var mergeRequests = JSON.parse(response.body) || [];
                resolve(_.filter(mergeRequests, function (mergeRequest) {
                    return mergeRequest.target_branch == targetBranchId;
                }));
                return null;
            })
            .catch(function (error) {
                reject(new Error(error));
                return null;
            });
    });
};

module.exports = GitlabVcs;
