module.exports = function (id, targetBranch, sourceBranch, upvotes, downvotes, url) {
    this.id = id;
    this.targetBranch = targetBranch;
    this.sourceBranch = sourceBranch;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.url = url;
};
