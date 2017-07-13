var Pipeline = function (id, scope, status, branch, commit, url) {
    var self = this;

    self.id = id;
    self.scope = scope;
    self.status = ko.observable(status);
    self.branch = branch;
    self.commit = commit;
    self.url = url;
};