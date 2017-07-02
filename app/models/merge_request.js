var MergeRequest = function (id, targetBranch, sourceBranch, upvotes, downvotes, url) {
    var self = this;

    self.id = id;
    self.targetBranch = targetBranch;
    self.sourceBranch = sourceBranch;
    self.upvotes = upvotes;
    self.downvotes = downvotes;
    self.url = url;
};

MergeRequest.get = function (gitlabApi, project) {
    var self = this;
    return new Promise(function (resolve, reject) {
        gitlabApi.getResource('/projects/' + project.id + '/merge_requests?state=opened')
            .then(function (mergeRequests) {
                project.mergeRequest = _.map(mergeRequests, function (mergeRequest) {
                    return new MergeRequest(mergeRequest.id, mergeRequest.target_branch, mergeRequest.source_branch, mergeRequest.upvotes,
                        mergeRequest.downvotes, mergeRequest.web_url);
                });
                resolve();
            })
            .catch(function (error) {
                reject(error);
            });
    });
};
