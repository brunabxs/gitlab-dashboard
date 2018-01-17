var _ = require('underscore');
var Promise = require('bluebird');

var GitlabVcs = require('../models/gitlab_vcs.js');
var Log = require('../models/log.js');

module.exports = function () {
    var self = this;

    var loadStorageSettings = function (storage) {
        return new Promise(function (resolve, reject) {
            Log.debug('[Installation - UpdateLegacyStorage]', 'Version control systems settings load requested');
            storage.load();
            storage.$get().getVcss()
                .then(function (loadedVcss) {
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Version control systems settings loaded');
                    resolve(loadedVcss);
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Installation - UpdateLegacyStorage]', 'Version control system settings load error', error);
                    reject(error);
                    return null;
                });
        });
    };

    var loadLegacyStorageSettings = function (legacyStorage) {
        return new Promise(function (resolve, reject) {
            Log.debug('[Installation - UpdateLegacyStorage]', 'Legacy configurations load requested');
            legacyStorage.load();
            legacyStorage.$get().getApiConfig()
                .then(function (config) {
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Legacy configurations loaded');
                    resolve(config);
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Installation - UpdateLegacyStorage]', 'Legacy configurations load error', error);
                    reject(error);
                    return null;
                });
        });
    };

    var loadProjectsSettingsFromLegacyStorage = function (config) {
        var tmpProjectsSettings = {};
        var legacyProjectsSettings = config.projects_settings;

        _.each(legacyProjectsSettings, function (element, index) {
            if (element.visible) {
                var projectId = index.split('#')[0];
                var branchId = index.split('#')[1];

                if (tmpProjectsSettings[projectId]) {
                    tmpProjectsSettings[projectId].push(branchId);
                }
                else {
                    tmpProjectsSettings[projectId] = [branchId];
                }
            }
        });

        var projectsSettings = [];
        _.each(tmpProjectsSettings, function (branches, projectId) {
            projectsSettings.push({
                id: parseInt(projectId, 10),
                branches: _.map(branches, function (branchId) {
                    return { id: branchId };
                })
            });
        });
        Log.debug('[Installation - UpdateLegacyStorage]', 'Legacy configurations loaded');
        return projectsSettings;
    };

    this.update = function (storage, legacyStorage) {
        return new Promise(function (resolve, reject) {
            var promises = [];
            promises.push(loadLegacyStorageSettings(legacyStorage));
            promises.push(loadStorageSettings(storage));
            Promise.all(promises)
                .then(function (responses) {
                    var config = responses[0];
                    var loadedVcss = responses[1];
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Legacy configurations and Version control system loaded');

                    if (!config.endpoint) {
                        Log.debug('[Installation - UpdateLegacyStorage]', 'Storage update not needed');
                        return Promise.resolve();
                    }

                    Log.debug('[Installation - UpdateLegacyStorage]', 'Storage update needed');
                    var projectsSettings = loadProjectsSettingsFromLegacyStorage(config);
                    var vcs = new GitlabVcs('Gitlab API', config.endpoint, config.token);
                    var serializedVcs = vcs.serialize();
                    serializedVcs.projects = projectsSettings;
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Version control systems settings save requested');
                    return storage.$get().saveVcss([serializedVcs]);
                })
                .then(function () {
                    legacyStorage.$get().clear();
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Legacy configurations cleared');
                    Log.debug('[Installation - UpdateLegacyStorage]', 'Version control systems settings saved');
                    resolve();
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Installation - UpdateLegacyStorage]', 'Legacy configurations or Version control system load error or Version control system save error', error);
                    reject(error);
                    return null;
                });
        });
    };
};
