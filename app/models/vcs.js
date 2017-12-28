var _ = require('underscore');
var Promise = require('bluebird');

var Log = require('./log.js');
var OnDemandArray = require('./on_demand_array.js');
var Project = require('./project.js');

var Vcs = function (projectsSettings) {
    var self = this;

    this.projectsSettings = projectsSettings || [];
    this.projects = new OnDemandArray(0, function () { return self._updateProjects(); });
};

Vcs.prototype._getProjectSettings = function (projectId) {
    var self = this;

    var projectSettings = _.findWhere(self.projectsSettings, { id: projectId });
    if (projectSettings) {
        self.projectsSettings = _.without(self.projectsSettings, projectSettings);
    }
    return projectSettings;
};

Vcs.prototype._updateProjects = function () {
    var self = this;

    var oldProjectIds = new Set();
    _.each(self.projects.list(), function (project) {
        oldProjectIds.add(project.id);
    });

    return new Promise(function (resolve, reject) {
        Log.debug('[Model - VCS]', 'Requesting projects for VCS');
        self.getProjects()
            .then(function (rawProjects) {
                Log.debug('[Model - VCS]', 'VCS projects retrieved');
                _.each(rawProjects, function (rawProject) {
                    var projectSettings = self._getProjectSettings(rawProject.id);
                    var isVisible = projectSettings ? true : false;
                    var project = new Project(self, rawProject.id, rawProject.name_with_namespace, rawProject.web_url, isVisible, projectSettings);

                    if (oldProjectIds.has(project.id)) {
                        oldProjectIds.delete(project.id);
                    }
                    else {
                        self.projects.add(project);
                        // TODO (brunabxs): add a callback to refresh view
                        Log.debug('[Model - VCS]', 'Project added');
                    }
                });

                // Copy array to avoid removing elements while iterating over them
                var projectsCopy = _.map(self.projects.list(), function (project) {
                    return project;
                });
                _.each(projectsCopy, function (projectCopy) {
                    if (oldProjectIds.has(projectCopy.id)) {
                        self.projects.remove(projectCopy);
                        // TODO (brunabxs): add a callback to refresh view
                        Log.debug('[Model - VCS]', 'Project removed');
                    }
                });

                Log.debug('[Model - VCS]', 'VCS projects updated');
                resolve();
            })
            .catch(function (error) {
                Log.error('[Model - VCS]', 'Error occurred while updating VCS projects', error);
                reject(error);
            });
    });
};

Vcs.prototype.serialize = function () { };
Vcs.prototype.getProjects = function () { };
Vcs.prototype.getBranches = function (projectId) { };
Vcs.prototype.getRecentPipeline = function (projectId, branchId) { };
Vcs.prototype.getRecentJob = function (projectId, pipelineId, pipelineStatus) { };
Vcs.prototype.getOpenedMergeRequests = function (projectId, sourceBranchId, targetBranchId) { };

module.exports = Vcs;
