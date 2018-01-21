var angular = require('angular');
var jquery = require('jquery');

var Analytics = require('../../models/analytics.js');
var LegacyStorageProvider = require('../../providers/legacy_storage.js');
var StorageProvider = require('../../providers/storage.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');
var VersionControlSystemsSettingsController = require('../../controllers/version_control_systems_settings.js');

var app = angular.module('SettingsApp', [])
    .provider('legacyStorage', LegacyStorageProvider)
    .provider('storage', StorageProvider)
    .config(function (legacyStorageProvider, storageProvider) {
        legacyStorageProvider.load(BROWSER);
        storageProvider.load(BROWSER);
    })
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('VersionControlSystemsSettingsController', ['versionControlSystemsService', '$scope', '$interval', VersionControlSystemsSettingsController]);

jquery(document).ready(function () {
    var ga = new Analytics(GA_ID);
    ga.set('checkProtocolTask', function () { });
    ga.set('dimension1', VERSION);
    ga.set('dimension2', BROWSER);
    ga.set('page', '/settings');
    ga.pageview('/settings');
});
