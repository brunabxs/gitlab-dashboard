var _ = require('underscore');
var Promise = require('bluebird');

var Branch = require('./branch.js');
var Log = require('./log.js');
var OnDemandArray = require('./on_demand_array.js');

var Project = function (vcs, id, name, url, visible, settings) {
    var self = this;

    this._vcs = vcs;
    this.id = id;
    this.name = name;
    this.url = url;
    this.visible = visible || false;
    this.settings = settings || {};
    this.branches = new OnDemandArray(0, function () { return self._updateBranches(); });
};

Project.prototype._getBranchSettings = function (branchId) {
    var self = this;

    var branchSettings = _.findWhere(self.settings.branches, { id: branchId });
    if (branchSettings) {
        self.settings.branches = _.without(self.settings.branches, branchSettings);
    }
    return branchSettings;
};


Project.prototype.serialize = function () {
    var self = this;

    if (!self.visible)
        return undefined;
    
    return {
        id: self.id,
        branches: self.branches.serialize()
    };
};

Project.prototype._updateBranches = function () {
    var self = this;

    var oldBranchIds = new Set();
    _.each(self.branches.list(), function (branch) {
        oldBranchIds.add(branch.id);
    });

    return new Promise(function (resolve, reject) {
        Log.debug('[Model - Project]', 'Requesting project branches for VCS');
        self._vcs.getBranches(self.id)
            .then(function (rawBranches) {
                Log.debug('[Model - Project]', 'Project branches retrieved');
                _.each(rawBranches, function (rawBranch) {
                    var branchSettings = self._getBranchSettings(rawBranch.name);
                    var isVisible = branchSettings ? true : false;
                    var branch = new Branch(self._vcs, self.id, rawBranch.name, rawBranch.name, isVisible, branchSettings);

                    if (oldBranchIds.has(branch.id)) {
                        oldBranchIds.delete(branch.id);
                    }
                    else {
                        self.branches.add(branch);
                        Log.debug('[Model - Project]', 'Branch added');
                    }
                });

                // Copy array to avoid removing elements while iterating over them
                var branchesCopy = _.map(self.branches.list(), function (branch) {
                    return branch;
                });
                _.each(branchesCopy, function (branchCopy) {
                    if (oldBranchIds.has(branchCopy.id)) {
                        self.branches.remove(branchCopy);
                        Log.debug('[Model - Project]', 'Branch removed');
                    }
                });

                Log.debug('[Model - Project]', 'Project branches updated');
                resolve();
            })
            .catch(function (error) {
                Log.error('[Model - Project]', 'Error occurred while updating project branches', error);
                reject(error);
            });
    });
};

module.exports = Project;
