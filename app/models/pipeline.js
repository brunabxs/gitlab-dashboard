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

Pipeline.viewModel = undefined;
Pipeline.api = undefined;

Pipeline.load = function () {
    var self = this;
    var api = Pipeline.api;

    api.getRecentPipeline(self.id, self.branch)
        .then(function (pipeline) {
            if (pipeline) {
                return api.getRecentJobWithScope(self.id, pipeline.id, pipeline.status);
            }
            return Promise.resolve();
        })
        .then(function (job) {
            if (job) {
                var pipeline = job.pipeline;
                self.pipeline(new Pipeline(pipeline.id, job.stage, pipeline.status, pipeline.ref, job.commit.short_id, ''));
            }
            return null;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
};

module.exports = Pipeline;
