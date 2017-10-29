var _ = require('underscore');
var angular = require('angular');

var ApiService = require('../../services/api.js');
var DashboardService = require('../../services/dashboard.js');

var OptionsController = require('../../controllers/options.js');
var ProjectsController = require('../../controllers/projects.js');

var LogProvider = require('../../providers/log.js');
var StorageProvider = require('../../providers/storage.js');

var app = angular.module('OptionsApp', [])
    .provider('log', LogProvider)
    .provider('storage', StorageProvider, LogProvider)
    .config(function(storageProvider, logProvider) {
        logProvider.load();
        storageProvider.load();
    })
    .service('api', ['log', 'storage', '$interval', ApiService])
    .service('dashboard', ['log', 'storage', DashboardService])
    .controller('ProjectsController', ['log', 'api', 'dashboard', '$scope', '$interval', '$timeout', ProjectsController])
    .controller('OptionsController', ['log', 'api', 'dashboard', '$scope', '$interval', '$timeout', OptionsController]);
