var _ = require('underscore');
var Promise = require('bluebird');

var GitlabVcs = require('../models/gitlab_vcs.js');
var Log = require('../models/log.js');

module.exports = function (storage) {
    var self = this;

    this.vcss = [];
    this.types = ['gitlab'];

    this.load = function () {
        return new Promise(function (resolve, reject) {
            Log.debug('[Service - VersionControlSystems]', 'Version control systems settings load requested');
            storage.getVcss()
                .then(function (loadedVcss) {
                    _.each(loadedVcss, function (loadedVcs) {
                        self.add(loadedVcs.type, loadedVcs.name, loadedVcs.settings, loadedVcs.projects);
                    });
                    Log.debug('[Service - VersionControlSystems]', 'Version control systems settings loaded');
                    resolve();
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Service - VersionControlSystems]', 'Version control system load error', error);
                    reject(error);
                    return null;
                });
        });
    };

    this.add = function (type, name, settings, projectsSettings) {
        var vcs;
        if (type === 'gitlab') {
            vcs = new GitlabVcs(name || 'Gitlab API', settings.endpoint, settings.token, projectsSettings);
        }
        else {
            Log.error('[Service - VersionControlSystems]', 'Version control system unknown');
            return;
        }

        self.vcss.push(vcs);
        vcs.projects.listAndUpdate();
        Log.debug('[Service - VersionControlSystems]', 'Version control system added');
    };

    this.removeByIndex = function (index) {
        self.vcss.splice(index, 1);
        Log.debug('[Service - VersionControlSystems]', 'Version control system removed');
    };

    this.save = function () {
        Log.debug('[Service - VersionControlSystems]', 'Version control systems settings save requested');
        storage.saveVcss(self.vcss)
            .then(function (item) {
                Log.debug('[Service - VersionControlSystems]', 'Version control systems settings saved');
            })
            .catch(function (error) {
                Log.error('[Service - VersionControlSystems]', 'Version control system save error', error);
            });
    };
};
