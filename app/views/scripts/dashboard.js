var angular = require('angular');

var AnalyticsService = require('../../services/analytics.js');
var StorageProvider = require('../../providers/storage.js');
var NavbarController = require('../../controllers/navbar.js');
var VersionControlSystemsController = require('../../controllers/version_control_systems.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');

var app = angular.module('DashboardApp', [])
    .constant('page', '/dashboard')
    .constant('analyticsId', GA_ID)
    .constant('version', VERSION)
    .constant('browser', BROWSER)
    .provider('storage', StorageProvider)
    .config(function (storageProvider) {
        storageProvider.load(BROWSER);
    })
    .service('analyticsService', ['storage', 'analyticsId', 'version', 'browser', 'page', AnalyticsService])
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('NavbarController', ['analyticsService', '$scope', NavbarController])
    .controller('VersionControlSystemsController', ['analyticsService', 'versionControlSystemsService', '$scope', '$interval', VersionControlSystemsController]);
