var _ = require('underscore');

var Log = require('../models/log.js');

module.exports = function (versionControlSystemsService, $scope, $interval) {
    $scope.vcss = versionControlSystemsService.vcss;

    $scope.visibleBranches = function () {
        var branches = [];
        _.each($scope.vcss, function (vcs) {
            _.each(vcs.projects.listAndUpdate(), function (project) {
                if (project.visible) {
                    _.each(project.branches.listAndUpdate(), function (branch) {
                        if (branch.visible) {
                            branch.project = project;
                            branches.push(branch);
                        }
                    });
                }
            });
        });
        return branches;
    };

    versionControlSystemsService.load();

    $interval(function () {
        Log.debug('[Controller - VersionControlSystemsController]', 'Interface updated');
    }, 1000);
};
