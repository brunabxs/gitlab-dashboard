var _ = require('underscore');
var Promise = require('bluebird');
var uuidv4 = require('uuid/v4');

module.exports = function () {
    var storage;

    var get = function (defaultItem) {
        return new Promise(function (resolve, reject) {
            storage.get(defaultItem, function (item) {
                resolve(item);
            });
        });
    };

    var set = function (item) {
        return new Promise(function (resolve, reject) {
            storage.set(item, function () {
                resolve(item);
            });
        });
    };

    return {
        load: function (browser) {
            if (browser == 'chrome') {
                storage = window.chrome.storage.sync;
            }
            else {
                storage = window.browser.storage.local;
            }
        },
        $get: function () {
            function getVcss() {
                return new Promise(function (resolve, reject) {
                    get({
                        vcss: []
                    })
                        .then(function (item) {
                            resolve(item.vcss);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function saveVcss(vcss) {
                return new Promise(function (resolve, reject) {
                    set({
                        vcss: vcss
                    })
                        .then(function (item) {
                            resolve(item.vcss);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function getAnalytics() {
                var self = this;
                return new Promise(function (resolve, reject) {
                    get({
                        analytics: {}
                    })
                        .then(function (item) {
                            if (_.isEmpty(item.analytics)) {
                                return set({ analytics: { clientId: uuidv4() } });
                            }
                            return Promise.resolve(item);
                        })
                        .then(function (item) {
                            resolve(item.analytics);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            return {
                getVcss: getVcss,
                saveVcss: saveVcss,
                getAnalytics: getAnalytics
            };
        }
    };
};
