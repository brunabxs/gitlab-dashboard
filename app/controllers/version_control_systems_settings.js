var _ = require('underscore');
var jquery = require('jquery');

var Log = require('../models/log.js');

module.exports = function (versionControlSystemsService, $scope, $interval) {
    $scope.newVcs = {};
    $scope.types = versionControlSystemsService.types;
    $scope.vcss = versionControlSystemsService.vcss;

    $scope.selectedVcs = undefined;
    $scope.selectedProject = undefined;
    $scope.selectedProjects = [];
    $scope.selectedBranches = [];

    $scope.hasChangesToSave = false;

    var resetNewVcs = function () {
        $scope.newVcs = {
            name: undefined,
            type: undefined,
            endpoint: undefined,
            token: undefined,
        };
    };

    var showNewVcsForm = function () {
        jQuery('#new-vcs').validator('update');
        jQuery('#new-vcs').show();
        jQuery('#vcs-list').hide();
        jQuery('#projects').hide();
        jQuery('#branches').hide();
        jQuery('#buttons').hide();
    };

    var hideNewVcsForm = function () {
        jQuery('#new-vcs').validator('destroy');
        jQuery('#new-vcs').hide();
        jQuery('#vcs-list').show();
        jQuery('#buttons').show();
    };

    var showConfigureActions = function (index) {
        jQuery('.vcs-actions').hide();
        jQuery('.vcs-selected-actions').show();
        hideVcssList(index);
    };

    var hideConfigureActions = function (index) {
        jQuery('.vcs-actions').show();
        jQuery('.vcs-selected-actions').hide();
        showVcssList(index);
        hideConfigureProjectsAndBranches();
    };

    var showConfigureProjects = function (index) {
        jQuery('#projects').show();
        jQuery('#branches').hide();
    };

    var showConfigureBranches = function (index) {
        jQuery('#projects').hide();
        jQuery('#branches').show();
    };

    var hideConfigureProjectsAndBranches = function () {
        jQuery('#projects').hide();
        jQuery('#branches').hide();
    };

    var showVcssList = function (index) {
        jQuery('#new').show();
        jQuery('#vcs-list .vcs').show();
    };

    var hideVcssList = function (index) {
        jQuery('#new').hide();
        jQuery('#vcs-list .vcs').hide();
        jQuery('#vcs-list #vcs-' + index).show();
    };

    var showMessages = function (type, message) {
        jQuery('#buttons').hide();
        jQuery('#messages .alert-' + type + ' span').text(message);
        jQuery('#messages .alert-' + type).show().delay(2000).fadeOut(400, function () {
            jQuery('#buttons').show();
        });
    };

    $scope.showAddVcs = function (index) {
        resetNewVcs();
        showNewVcsForm();
    };

    $scope.addVcs = function () {
        $scope.hasChangesToSave = true;
        versionControlSystemsService.add($scope.newVcs.type, $scope.newVcs.name, { endpoint: $scope.newVcs.endpoint, token: $scope.newVcs.token });
        hideNewVcsForm();
    };

    $scope.cancelAddVcs = function () {
        hideNewVcsForm();
    };

    $scope.removeVcs = function (index) {
        $scope.hasChangesToSave = true;
        versionControlSystemsService.removeByIndex(index);
    };

    $scope.saveVcs = function () {
        versionControlSystemsService.save()
            .then(function () {
                showMessages('success', 'Changes have been saved.');
                $scope.hasChangesToSave = false;
            })
            .catch(function (error) {
                showMessages('error', 'Error while saving changes.');
            });
    };

    $scope.visible = function (items) {
        return _.filter(items, function (item) {
            return item.visible;
        });
    };

    $scope.selectVcs = function (index) {
        $scope.selectedVcs = $scope.vcss[index];
        $scope.selectedProject = undefined;
        $scope.initSelectedProjects();
        showConfigureActions(index);
    };

    $scope.showProjects = function (index) {
        showConfigureProjects(index);
    };

    $scope.showBranches = function (index) {
        showConfigureBranches(index);
    };

    $scope.close = function (index) {
        hideConfigureActions(index);
    };

    $scope.initSelectedProjects = function () {
        $scope.selectedProjects = [];
        _.each($scope.visible($scope.selectedVcs.projects.listAndUpdate()), function (project) {
            $scope.selectedProjects.push(project.id);
            project.branches.listAndUpdate();
        });
    };

    $scope.initSelectedBranches = function () {
        $scope.selectedBranches = [];
        _.each($scope.visible($scope.selectedProject.branches.listAndUpdate()), function (branch) {
            $scope.selectedBranches.push(branch.id);
        });
    };

    $scope.updateProjects = function () {
        _.each($scope.selectedVcs.projects.listAndUpdate(), function (project) {
            var index = _.indexOf($scope.selectedProjects, project.id);
            project.visible = (index >= 0);
        });
        $scope.hasChangesToSave = true;
    };

    $scope.updateBranches = function () {
        _.each($scope.selectedProject.branches.listAndUpdate(), function (branch) {
            var index = _.indexOf($scope.selectedBranches, branch.id);
            branch.visible = (index >= 0);
        });
        $scope.hasChangesToSave = true;
    };

    versionControlSystemsService.load();

    $interval(function () {
        _.each($scope.vcss, function (item, index) {
            jQuery('select').selectpicker('refresh');
        });

        Log.debug('[Controller - VersionControlSystemsSettingsController]', 'Interface updated');
    }, 1000);
};
