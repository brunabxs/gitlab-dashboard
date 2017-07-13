var Project = function (id, name, url) {
    var self = this;

    self.id = id;
    self.name = name;
    self.url = url;
    self.pipeline = ko.observable();
    self.mergeRequests = ko.observableArray([]);
};

Project.get = function (gitlabApi) {
    var self = this;
    var projects;
    return new Promise(function (resolve, reject) {
        gitlabApi.getResource('/projects?membership=true')
            .then(function (data) {
                projects = _.map(data, function (project) {
                    return new Project(project.id, project.name, project.web_url);
                });
                return Promise.resolve(projects);
            })
            .then(function (data) {
                var promises = [];
                _.each(data, function (project) {
                    promises.push(MergeRequest.get(gitlabApi, project));
                });
                return Promise.all(promises);
            })
            .then(function (data) {
                resolve(projects);
            })
            .catch(function (error) {
                reject(error);
            });
    });
};
