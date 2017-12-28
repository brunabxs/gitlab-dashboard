module.exports = function (vcs, id, targetBranchId, sourceBranchId, upvotes, downvotes, url) {
    this._vcs = vcs;
    this.id = id;
    this.targetBranchId = targetBranchId;
    this.sourceBranchId = sourceBranchId;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.url = url;
};
