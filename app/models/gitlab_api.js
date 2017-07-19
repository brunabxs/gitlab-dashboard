var $ = require('jquery');
var Promise = require('bluebird');

var GitlabApi = function (gitlabApiEndpoint, gitlabPrivateToken) {
    var self = this;

    self.gitlabApiEndpoint = gitlabApiEndpoint;
    self.gitlabPrivateToken = gitlabPrivateToken;
};

GitlabApi.prototype.getResource = function (resource) {
    var self = this;
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: self.gitlabApiEndpoint + resource,
            headers: {
                'PRIVATE-TOKEN': self.gitlabPrivateToken
            },
        })
            .done(function (data, textStatus, jqXHR) {
                resolve(data);
                return null;
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                // TODO: return a better error
                reject(new Error(textStatus));
                return null;
            });
    });
};

module.exports = GitlabApi;
