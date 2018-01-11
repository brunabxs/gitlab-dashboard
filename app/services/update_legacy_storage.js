var _ = require('underscore');
var Promise = require('bluebird');

var GitlabVcs = require('../models/gitlab_vcs.js');
var Log = require('../models/log.js');

module.exports = function (legacyStorage, storage) {
    var self = this;

    this.loading = true;
    this.storageEmpty = undefined;
    this.legacyStorageEmpty = undefined;

    var loadStorage = function () {
        return new Promise(function (resolve, reject) {
            Log.debug('[Service - UpdateLegacyStorage]', 'Version control systems settings load requested');
            storage.getVcss()
                .then(function (loadedVcss) {
                    self.storageEmpty = (loadedVcss.length == 0);
                    Log.debug('[Service - UpdateLegacyStorage]', 'Version control systems settings loaded');
                    resolve(loadedVcss);
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Service - UpdateLegacyStorage]', 'Version control system settings load error', error);
                    reject(error);
                    return null;
                });
        });
    };

    var loadLegacyStorage = function () {
        return new Promise(function (resolve, reject) {
            Log.debug('[Service - UpdateLegacyStorage]', 'Legacy configurations load requested');
            legacyStorage.getApiConfig()
                .then(function (config) {
                    self.legacyStorageEmpty = (!config.endpoint);
                    Log.debug('[Service - UpdateLegacyStorage]', 'Legacy configurations loaded');
                    resolve(config);
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Service - UpdateLegacyStorage]', 'Legacy configurations load error', error);
                    reject(error);
                    return null;
                });
        });
    };
    
    this.load = function () {
        loadStorage()
            .then(function () {
                return loadLegacyStorage();
            })
            .then(function () {
                self.loading = false;
                return null;
            })
            .catch(function () {
                self.load();
                return null;
            });
    };

    this.update = function () {
        return new Promise(function (resolve, reject) {
            legacyStorage.getApiConfig()
                .then(function (config) {
                    if (!config.endpoint) {
                        return Promise.resolve();
                    }

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

                    var vcs = new GitlabVcs('Gitlab API', config.endpoint, config.token);
                    var serializedVcs = vcs.serialize();
                    serializedVcs.projects = projectsSettings;

                    Log.debug('[Service - UpdateLegacyStorage]', 'Legacy configurations loaded');

                    Log.debug('[Service - UpdateLegacyStorage]', 'Version control systems settings save requested');
                    return storage.saveVcss([serializedVcs]);
                })
                .then(function () {
                    legacyStorage.clear();
                    Log.debug('[Service - UpdateLegacyStorage]', 'Version control systems settings saved');
                    resolve();
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Service - UpdateLegacyStorage]', 'Legacy configurations load error or Version control system save error', error);
                    reject(error);
                    return null;
                });
        });
    };

    this.canUpdate = function () {
        if (self.loading) {
            return undefined;
        }
        else {
            return self.storageEmpty && !self.legacyStorageEmpty;
        }
    };

    this.load();
};
