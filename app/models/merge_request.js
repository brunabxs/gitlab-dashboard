var _ = require('underscore');

var MergeRequest = function (id, targetBranch, sourceBranch, upvotes, downvotes, url) {
    var self = this;

    self.id = id;
    self.targetBranch = targetBranch;
    self.sourceBranch = sourceBranch;
    self.upvotes = upvotes;
    self.downvotes = downvotes;
    self.url = url;
};

MergeRequest.viewModel = undefined;
MergeRequest.api = undefined;

MergeRequest.load = function () {
    var self = this;
    var api = MergeRequest.api;

    api.getOpenedMergeRequests(self.id)
        .then(function (mergeRequests) {
            self.mergeRequests(_.map(mergeRequests, function (mergeRequest) {
                return new MergeRequest(mergeRequest.id, mergeRequest.target_branch, mergeRequest.source_branch, mergeRequest.upvotes,
                    mergeRequest.downvotes, mergeRequest.web_url);
            }));
            return null;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
};

module.exports = MergeRequest;
