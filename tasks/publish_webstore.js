var _fs = require('fs');
var fs = require('q-io/fs');
var FileStorage = require('chrome-store-api').FileStorage;
var TokenManager = require('chrome-store-api').TokenManager;
var WebstoreApi = require('chrome-store-api').Webstore;

module.exports = function (done) {
    var package = JSON.parse(_fs.readFileSync('./package.json'));

    var appId = process.env.APP_ID;
    var zip = 'dist/gitlab-dashboard-' + package.version + '.zip';

    var clientId = process.env.CLIENT_ID;
    var clientSecret = process.env.CLIENT_SECRET;
    var code = process.env.CODE;

    var storageFilePath = './webstore_storage.json';
    var accessToken = process.env.ACCESS_TOKEN;
    var refreshToken = process.env.REFRESH_TOKEN;

    var storage = new FileStorage(storageFilePath);
    var tokenManager = new TokenManager(code, clientId, clientSecret, storage);
    var api = new WebstoreApi(tokenManager);

    var publish = function () {
        // api.get(appId)
        //     .then(function (data) {
        //         console.log(JSON.stringify(data));
        //         done();
        //     })
        //     .catch(function (err) {
        //         console.log(JSON.stringify(err));
        //         done(false);
        //     });
        fs.read(zip, 'b')
            .then(function (blob) {
                return api.update(appId, blob);
            })
            .then(function (data) {
                return api.publish(appId);
            })
            .then(function (data) {
                done();
            })
            .catch(function (error) {
                done(false);
            });
    };

    fs.exists(storageFilePath)
        .then(function (exists) {
            if (accessToken && refreshToken) {
                return storage.set(code, accessToken, refreshToken);
            }
            return Promise.resolve();
        })
        .then(publish);
};