var angular = require('angular');

var AnalyticsService = require('../../services/analytics.js');
var StorageProvider = require('../../providers/storage.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');
var VersionControlSystemsSettingsController = require('../../controllers/version_control_systems_settings.js');

var app = angular.module('SettingsApp', [])
    .constant('page', '/settings')
    .constant('analyticsId', GA_ID)
    .constant('version', VERSION)
    .constant('browser', BROWSER)
    .provider('storage', StorageProvider)
    .config(function (storageProvider) {
        storageProvider.load(BROWSER);
    })
    .service('analyticsService', ['storage', 'analyticsId', 'version', 'browser', 'page', AnalyticsService])
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('VersionControlSystemsSettingsController', ['analyticsService', 'versionControlSystemsService', '$scope', '$interval', VersionControlSystemsSettingsController]);
