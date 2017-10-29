var Promise = require('bluebird');

module.exports = function() {
    var get = function (defaultItem) {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(defaultItem, function (item) {
                resolve(item);
            });
        });
    };

    var set = function (item) {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(item, function () {
                resolve(item);
            });
        });
    };

    return {
        load: function () {
            // TODO: if old 'gitlab' 'gitlabPrivateToken' 'dashboardRefreshRate' 'projectsInfo'
            //       exist, move their values
            // TODO: remove old 'gitlab' 'gitlabPrivateToken' 'dashboardRefreshRate' 'projectsInfo'
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

            return {
                getDashboardConfig: getDashboardConfig,
                getApiConfig: getApiConfig,
                saveDashboardConfig: saveDashboardConfig,
                saveApiConfig: saveApiConfig
            };
        }
    };
};
