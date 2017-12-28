module.exports = function (vcs, id, stage, status, commit, url) {
    this._vcs = vcs;
    this.id = id;
    this.stage = stage;
    this.status = status;
    this.commit = commit;
    this.url = url;
};
