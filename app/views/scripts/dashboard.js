var _ = require('underscore');
var angular = require('angular');

var ApiService = require('../../services/api.js');
var DashboardService = require('../../services/dashboard.js');

var ProjectsController = require('../../controllers/projects.js');

var LogProvider = require('../../providers/log.js');
var StorageProvider = require('../../providers/storage.js');

var app = angular.module('DashboardApp', [])
    .provider('log', LogProvider)
    .provider('storage', StorageProvider, LogProvider)
    .config(function(storageProvider, logProvider) {
        logProvider.load();
        storageProvider.load(BROWSER);
    })
    .service('api', ['log', 'storage', '$interval', ApiService])
    .service('dashboard', ['log', 'storage', DashboardService])
    .controller('ProjectsController', ['log', 'api', 'dashboard', '$scope', '$interval', '$timeout', ProjectsController]);
