var _ = require('underscore');
var Promise = require('bluebird');

var Pipeline = function (id, scope, status, branch, commit, url) {
    var self = this;

    self.id = id;
    self.scope = scope;
    self.status = status;
    self.branch = branch;
    self.commit = commit;
    self.url = url;
};

Pipeline.loadAll = function (gitlabApi, dashboard) {
    var self = this;
    _.each(dashboard.projects(), function (project) {
        Pipeline.load(gitlabApi, dashboard, project);
    });
};

Pipeline.updateAll = function (gitlabApi, dashboard) {
    var self = this;
    Pipeline.loadAll(gitlabApi, dashboard);
};

Pipeline.load = function (gitlabApi, dashboard, project) {
    var self = this;
    gitlabApi.getResource('/projects/' + project.id + '/pipelines?ref=master&sort=desc')
        .then(function (pipelines) {
            if (pipelines.length > 0) {
                return gitlabApi.getResource('/projects/' + project.id + '/pipelines/' + pipelines[0].id);
            }
            return Promise.resolve();
        })
        .then(function (pipeline) {
            if (pipeline) {
                return gitlabApi.getResource('/projects/' + project.id + '/pipelines/' + pipeline.id + '/jobs?scope[]=' + pipeline.status);
            }
            return Promise.resolve();
        })
        .then(function (jobs) {
            if (jobs) {
                jobs = jobs.sort(function (jobLeft, jobRight) {
                    return new Date(jobRight.started_at) - new Date(jobLeft.started_at);
                });

                var job = jobs[0];
                var pipeline = job.pipeline;
                project.pipeline(new Pipeline(pipeline.id, job.stage, pipeline.status, pipeline.ref, job.commit.short_id, ''));
            }
            return null;
        })
        .catch(function (error) {
            dashboard.erros.push(error);
            return null;
        });
};

module.exports = Pipeline;
