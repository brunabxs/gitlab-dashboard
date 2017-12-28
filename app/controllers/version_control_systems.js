var Log = require('../models/log.js');

module.exports = function (versionControlSystemsService, $scope, $interval) {
    $scope.vcss = versionControlSystemsService.vcss;

    versionControlSystemsService.load();

    $interval(function () {
        Log.debug('[Controller - VersionControlSystemsController]', 'Interface updated');
    }, 1000);
};
