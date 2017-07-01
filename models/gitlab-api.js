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
        self.getResource('/projects?membership=true')
            .then(function (projects) {
                resolve(_.map(projects, function (project) {
                    return {
                        'id': project.id,
                        'name': project.name,
                        'url': project.web_url,
                    };
                }));
            })
            .catch(function (error) {
                reject(error);
            });
    });
};