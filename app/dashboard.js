function DashboardViewModel() {
  var self = this;

  self.api = new GitlabApi('https://gitlab.com/api/v4', '3oBioprn2GjJ52bdwBJ2');
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
    attribute: "data-bind",
    globals: window,
    bindings: ko.bindingHandlers,
    noVirtualElements: false,
  });

  ko.applyBindings(new DashboardViewModel());
});