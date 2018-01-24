var angular = require('angular');

var Analytics = require('../../models/analytics.js');
var StorageProvider = require('../../providers/storage.js');
var NavbarController = require('../../controllers/navbar.js');
var VersionControlSystemsController = require('../../controllers/version_control_systems.js');
var VersionControlSystemsService = require('../../services/version_control_systems.js');

var app = angular.module('DashboardApp', [])
    .provider('storage', StorageProvider)
    .config(function (storageProvider) {
        storageProvider.load(BROWSER);
    })
    .service('versionControlSystemsService', ['storage', VersionControlSystemsService])
    .controller('NavbarController', ['$scope', NavbarController])
    .controller('VersionControlSystemsController', ['versionControlSystemsService', '$scope', '$interval', VersionControlSystemsController]);

document.addEventListener('DOMContentLoaded', function (event) {
    var ga = new Analytics(GA_ID, BROWSER, VERSION, '/dashboard');
    ga.pageview();
});
