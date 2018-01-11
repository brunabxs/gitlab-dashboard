var angular = require('angular');

var LegacyStorageProvider = require('../../providers/legacy_storage.js');
var StorageProvider = require('../../providers/storage.js');
// TODO (brunabxs): Remove this service and all its references when all users migrate to >1.0.0
var UpdateLegacyStorageService = require('../../services/update_legacy_storage.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');
var VersionControlSystemsSettingsController = require('../../controllers/version_control_systems_settings.js');

var app = angular.module('SettingsApp', [])
    .provider('legacyStorage', LegacyStorageProvider)
    .provider('storage', StorageProvider)
    .config(function (legacyStorageProvider, storageProvider) {
        legacyStorageProvider.load(BROWSER);
        storageProvider.load(BROWSER);
    })
    .service('updateLegacyStorageService', ['legacyStorage', 'storage', UpdateLegacyStorageService])
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('VersionControlSystemsSettingsController', ['updateLegacyStorageService', 'versionControlSystemsService', '$scope', '$timeout', '$interval', VersionControlSystemsSettingsController]);
