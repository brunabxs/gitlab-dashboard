var angular = require('angular');

var StorageProvider = require('../../providers/storage.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');
var VersionControlSystemsSettingsController = require('../../controllers/version_control_systems_settings.js');

var app = angular.module('SettingsApp', [])
    .provider('storage', StorageProvider)
    .config(function (storageProvider) {
        storageProvider.load(BROWSER);
    })
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('VersionControlSystemsSettingsController', ['versionControlSystemsService', '$scope', '$interval', VersionControlSystemsSettingsController]);
