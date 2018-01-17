var Promise = require('bluebird');

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
            function getApiConfig() {
                return new Promise(function (resolve, reject) {
                    get({
                        api: {
                            endpoint: '',
                            token: '',
                            projects_settings: {}
                        }
                    })
                        .then(function (item) {
                            resolve(item.api);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function getDashboardConfig() {
                return new Promise(function (resolve, reject) {
                    get({
                        dashboard: {
                            refreshRateSec: 3
                        }
                    })
                        .then(function (item) {
                            resolve(item.dashboard);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function saveApiConfig(endpoint, token, projectsSettings) {
                return new Promise(function (resolve, reject) {
                    set({
                        api: {
                            endpoint: endpoint,
                            token: token,
                            projects_settings: projectsSettings
                        }
                    })
                        .then(function (item) {
                            resolve(item.dashboard);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function saveDashboardConfig(refreshRateSec) {
                return new Promise(function (resolve, reject) {
                    set({
                        dashboard: {
                            refreshRateSec: refreshRateSec
                        }
                    })
                        .then(function (item) {
                            resolve(item.dashboard);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            }

            function clear() {
                return new Promise(function (resolve, reject) {
                    storage.remove(['api', 'dashboard'], function (item) {
                        resolve(item);
                    });
                });
            }

            return {
                getDashboardConfig: getDashboardConfig,
                getApiConfig: getApiConfig,
                saveDashboardConfig: saveDashboardConfig,
                saveApiConfig: saveApiConfig,
                clear: clear
            };
        }
    };
};
