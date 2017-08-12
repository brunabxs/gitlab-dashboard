var _ = require('underscore');
var $ = require('jquery');
var ko = require('../../helpers/knockout.js');
var Chrome = require('../../models/chrome.js');
var GitlabApi = require('../../models/gitlab_api.js');
var Project = require('../../models/project.js');

function saveOptions() {
    var projectsInfo = {};
    _.each($('.onoffswitch-checkbox'), function (item) {
        var idMatch = $(item).attr('id').match(/switch([0-9]+)/);
        if (idMatch) {
            var id = idMatch[1];
            projectsInfo[id] = {
                visible: $(item).prop('checked')
            };
        }
    });

    var callback = function () {
        $('#status').text('Options saved.');
        $('#save').hide();
        setTimeout(function () {
            $('#save').show();
            $('#status').text('');
        }, 750);
    };

    Chrome.set($('#gitlab').val(), $('#gitlab-private-token').val(), $('#dashboard-refresh-rate').val(), projectsInfo, callback);
}

function restoreOptions() {
    Chrome.get(function (items) {
        $('#gitlab').val(items.gitlab);
        $('#gitlab-private-token').val(items.gitlabPrivateToken);
        $('#dashboard-refresh-rate').val(items.dashboardRefreshRate);
    });
}

function ProjectsOptionsViewModel(api, projectsInfo) {
    var self = this;
    
    self.projects = ko.observableArray([]);

    Project.api = api;
    Project.viewModel = self;

    Project.loadAll(projectsInfo);
}

$(document).ready(function () {
    restoreOptions();
    $('#save').click(function () {
        saveOptions();
    });

    // TODO: create a link that will show the list of projects when clicked
    Chrome.get(function (items) {
        ko.applyBindings(new ProjectsOptionsViewModel(new GitlabApi(items.gitlab, items.gitlabPrivateToken), items.projectsInfo));
    });
});

