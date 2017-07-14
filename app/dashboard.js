function DashboardViewModel(gitlabApiEndpoint, gitlabPrivateToken) {
  var self = this;

  self.api = new GitlabApi(gitlabApiEndpoint, gitlabPrivateToken);
  self.projects = ko.observableArray([]);
  self.errors = ko.observableArray([]);

  Project.loadAll(self.api, self);
}

$(document).ready(function () {
  ko.bindingProvider.instance = new ko.secureBindingsProvider({
    attribute: 'data-bind',
    globals: window,
    bindings: ko.bindingHandlers,
    noVirtualElements: false,
  });

  chrome.storage.sync.get({
    'gitlab': '',
    'gitlabPrivateToken': ''
  }, function (items) {
    ko.applyBindings(new DashboardViewModel(items.gitlab, items.gitlabPrivateToken));
  });
});