var MergeRequest = function (id, targetBranch, sourceBranch, upvotes, downvotes, url) {
    var self = this;

    self.id = id;
    self.targetBranch = targetBranch;
    self.sourceBranch = sourceBranch;
    self.upvotes = upvotes;
    self.downvotes = downvotes;
    self.url = url;
};

MergeRequest.loadAll = function (gitlabApi, dashboard) {
    var self = this;
    _.each(dashboard.projects(), function (project) {
        MergeRequest.load(gitlabApi, dashboard, project);
    });
};

MergeRequest.updateAll = function (gitlabApi, dashboard) {
    var self = this;
    MergeRequest.loadAll(gitlabApi, dashboard);
};

MergeRequest.load = function (gitlabApi, dashboard, project) {
    var self = this;
    gitlabApi.getResource('/projects/' + project.id + '/merge_requests?state=opened')
        .then(function (mergeRequests) {
            project.mergeRequests(_.map(mergeRequests, function (mergeRequest) {
                return new MergeRequest(mergeRequest.id, mergeRequest.target_branch, mergeRequest.source_branch, mergeRequest.upvotes,
                    mergeRequest.downvotes, mergeRequest.web_url);
            }));
        })
        .catch(function (error) {
            dashboard.errors.push(error);
        });
};
