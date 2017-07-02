var WebstoreApi = require('chrome-store-api').Webstore;
var TokenManager = require('chrome-store-api').TokenManager;
var FileStorage = require('chrome-store-api').FileStorage;
var fs = require('q-io/fs');

module.exports = function (grunt) {
    grunt.registerTask('publish_webstore', function () {
        var _task = this;
        var extensionConfigPath = _task.name + '.extension';
        var accountConfigPath = _task.name + '.account';

        grunt.config.requires(extensionConfigPath);
        grunt.config.requires(accountConfigPath);

        var extension = grunt.config(extensionConfigPath);
        var appId = extension['appID'];
        var zip = extension['zip'];

        var account = grunt.config(accountConfigPath);
        var clientId = account['client_id'];
        var clientSecret = account['client_secret'];
        var code = account['code'];

        var done = this.async();
        var storage = new FileStorage(account['storage']);
        var tokenManager = new TokenManager(code, clientId, clientSecret, storage);
        var api = new WebstoreApi(tokenManager);

        var publish = function () {
            // api.get(appId)
            //     .then(function (data) {
            //         grunt.log.writeln(JSON.stringify(data));
            //         done();
            //     })
            //     .catch(function (err) {
            //         grunt.log.writeln(JSON.stringify(err));
            //         done(false);
            //     });

            fs.read(zip, 'b')
                .then(function (blob) {
                    return api.update(appId, blob);
                })
                .then(function (data) {
                    grunt.log.writeln(JSON.stringify(data));
                    return api.publish(appId);
                })
                .then(function (data) {
                    grunt.log.writeln(JSON.stringify(data));
                    done();
                })
                .catch(function (error) {
                    grunt.log.writeln(JSON.stringify(error));
                    done(false);
                });
        };

        fs.exists(account['storage'])
            .then(function (exists) {
                if (!exists && account['token']) {
                    return storage.set(code, account['token']);
                }
                return Promise.resolve();
            })
            .then(publish);
    });
};