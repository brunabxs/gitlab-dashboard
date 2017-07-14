function DashboardViewModel(gitlabApiEndpoint, gitlabPrivateToken) {
  var self = this;

  self.api = new GitlabApi(gitlabApiEndpoint, gitlabPrivateToken);
  self.projects = ko.observableArray([]);

  Project.get(self.api)
    .then(function (projects) {
      self.projects(projects);
    })
    .catch(function (error) {
      console.log(error);
    })
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