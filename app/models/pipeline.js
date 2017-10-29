module.exports = function (id, scope, status, branch, commit, url) {
    this.id = id;
    this.scope = scope;
    this.status = status;
    this.branch = branch;
    this.commit = commit;
    this.url = url;
};
