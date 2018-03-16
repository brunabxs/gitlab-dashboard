var _ = require('underscore');
var Promise = require('bluebird');

var Log = require('./log.js');
var MergeRequest = require('./merge_request.js');
var OnDemandArray = require('./on_demand_array.js');
var OnDemandObject = require('./on_demand_object.js');
var Pipeline = require('./pipeline.js');

var Branch = function (vcs, projectId, id, name, visible, settings) {
    var self = this;

    this._vcs = vcs;
    this.projectId = projectId;
    this.id = id;
    this.name = name;
    this.visible = visible || false;
    this.settings = settings || {};
    this.currentPipeline = new OnDemandObject(function () { return self._updatePipeline(); });
    this.openedMergeRequests = new OnDemandArray(0, function () { return self._updateOpenedMergeRequests(); });
};

Branch.prototype.status = function () {
    var self = this;

    if (self.currentPipeline.getAndUpdate()) {
        return self.currentPipeline.getAndUpdate().status;
    }
    return 'unavailable';
};

Branch.prototype.serialize = function () {
    var self = this;

    if (!self.visible)
        return undefined;
    
    return {
        id: self.id
    };
};

Branch.prototype._updatePipeline = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        Log.debug('[Model - Branch]', 'Requesting branch most recent pipeline for VCS');
        self._vcs.getRecentPipeline(self.projectId, self.id)
            .then(function (rawPipeline) {
                Log.debug('[Model - Branch]', 'Branch most recent pipeline retrieved');
                if (rawPipeline) {
                    return self._vcs.getRecentJob(self.projectId, rawPipeline.id, rawPipeline.status);
                }
                return Promise.resolve();
            })
            .then(function (rawJob) {
                if (rawJob) {
                    self.currentPipeline.set(new Pipeline(self._vcs, rawJob.pipeline.id, rawJob.stage, rawJob.pipeline.status, rawJob.commit.short_id, ''));
                }
                Log.debug('[Model - Branch]', 'Branch most recent pipeline updated');
                resolve();
            })
            .catch(function (error) {
                Log.error('[Model - Branch]', 'Error occurred while updating branch most recent pipeline', error);
                reject(error);
            });
    });
};

Branch.prototype._updateOpenedMergeRequests = function () {
    var self = this;

    var oldMergeRequetsIds = new Set();
    _.each(self.openedMergeRequests.list(), function (mergeRequest) {
        oldMergeRequetsIds.add(mergeRequest.id);
    });

    return new Promise(function (resolve, reject) {
        Log.debug('[Model - Branch]', 'Requesting branch opened merge requests for VCS');
        self._vcs.getOpenedMergeRequests(self.projectId, undefined, self.id)
            .then(function (rawMergeRequests) {
                Log.debug('[Model - Branch]', 'Branch opened merge requests retrieved');
                _.each(rawMergeRequests, function (rawMergeRequest) {
                    var mergeRequest = new MergeRequest(this._vcs, rawMergeRequest.id, rawMergeRequest.target_branch, rawMergeRequest.source_branch,
                        rawMergeRequest.upvotes, rawMergeRequest.downvotes, rawMergeRequest.web_url);

                    if (oldMergeRequetsIds.has(mergeRequest.id)) {
                        oldMergeRequetsIds.delete(mergeRequest.id);
                    }
                    else {
                        self.openedMergeRequests.add(mergeRequest);
                        Log.debug('[Model - Branch]', 'Opened merge request added');
                    }
                });

                // Copy array to avoid removing elements while iterating over them
                var mergeRequestsCopy = _.map(self.openedMergeRequests.list(), function (mergeRequest) {
                    return mergeRequest;
                });
                _.each(mergeRequestsCopy, function (mergeRequestCopy) {
                    if (oldMergeRequetsIds.has(mergeRequestCopy.id)) {
                        self.openedMergeRequests.remove(mergeRequestCopy);
                        Log.debug('[Model - Branch]', 'Opened merge request removed');
                    }
                });

                Log.debug('[Model - Branch]', 'Branch opened merge requests updated');
                resolve();
            })
            .catch(function (error) {
                Log.error('[Model - Branch]', 'Error occurred while updating branch opened merge requests', error);
                reject(error);
            });
    });
};

module.exports = Branch;
