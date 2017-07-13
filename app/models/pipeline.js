var Pipeline = function (id, scope, status, branch, commit, url) {
    var self = this;

    self.id = id;
    self.scope = scope;
    self.status = ko.observable(status);
    self.branch = branch;
    self.commit = commit;
    self.url = url;
};

Pipeline.get = function (gitlabApi, project) {
    var self = this;
    return new Promise(function (resolve, reject) {
        gitlabApi.getResource('/projects/' + project.id + '/pipelines?sort=desc')
            .then(function (pipelines) {
                if (pipelines.length > 0) {
                    return gitlabApi.getResource('/projects/' + project.id + '/pipelines/' + pipelines[0].id);
                }
                return Promise.resolve();
            })
            .then(function (pipeline) {
                if (pipeline) {
                    return gitlabApi.getResource('/projects/' + project.id + '/pipelines/' + pipeline.id + '/jobs');
                }
                return Promise.resolve();
            })
            .then(function (pipeline_jobs) {
                if (pipeline_jobs) {
                    var job = pipeline_jobs[0]; // TODO: pick a pipeline job
                    var pipeline = job.pipeline;
                    project.pipeline(new Pipeline(pipeline.id, job.stage, pipeline.status, pipeline.ref, job.commit.short_id, ''));
                }
                resolve();
            })
            .catch(function (error) {
                reject(error);
            });
    });
};