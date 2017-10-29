module.exports = function (id, name, branch, url) {
    this.id = id;
    this.name = name;
    this.branch = branch;
    this.url = url;
    this.visible = true;
    this._pipeline = undefined;
    this.mustLoadPipeline = false;

    this._mergeRequests = undefined;
    this.mustLoadMergeRequests = false;

    this.status = function () {
        if (this.pipeline()) {
            return this.pipeline().status;
        }
        return 'unavailable';
    };

    this.identifier = function () {
        return this.id + '#' + this.branch;
    };

    this.pipeline = function (pipeline) {
        this.mustLoadPipeline = true;
        if (pipeline !== undefined) {
            this._pipeline = pipeline;
        }
        return this._pipeline;
    };

    this.mergeRequests = function (mergeRequests) {
        this.mustLoadMergeRequests = true;
        if (mergeRequests !== undefined) {
            this._mergeRequests = mergeRequests;
        }
        return this._mergeRequests;
    };
};
