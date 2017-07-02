var GitLabApi = function (gitlabApiEndpoint, gitlabPrivateToken) {
    var self = this;

    self.gitlabApiEndpoint = gitlabApiEndpoint;
    self.gitlabPrivateToken = gitlabPrivateToken;
};

GitLabApi.prototype.getResource = function (resource) {
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
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // TODO: return a better error
                reject(textStatus);
            });
    });
};

GitLabApi.prototype.projects = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        var projects;
        self.getResource('/projects?membership=true')
            .then(function (data) {
                projects = _.map(data, function (project) {
                    return {
                        'id': project.id,
                        'name': project.name,
                        'url': project.web_url,
                    };
                });
                return Promise.resolve(projects);
            })
            .then(function (data) {
                var mergeRequestsPromises = [];
                _.each(data, function (project) {
                    mergeRequestsPromises.push(self.mergeRequests(project));
                });
                return Promise.all(mergeRequestsPromises);
            })
            .then(function (data) {
                resolve(projects);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};

GitLabApi.prototype.mergeRequests = function (project) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.getResource('/projects/' + project.id + '/merge_requests?state=opened')
            .then(function (mergeRequests) {
                project.mergeRequest = _.map(mergeRequests, function (mergeRequest) {
                    return {
                        'id': mergeRequest.id,
                        'target_branch': mergeRequest.target_branch,
                        'source_branch': mergeRequest.source_branch,
                        'upvotes': mergeRequest.upvotes,
                        'downvotes': mergeRequest.downvotes,
                        'url': mergeRequest.web_url,
                    };
                });
                resolve();
            })
            .catch(function (error) {
                reject(error);
            });
    });
};
