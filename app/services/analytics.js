var analytics = require('universal-analytics');

var Log = require('../models/log.js');

module.exports = function (storage, analyticsId, environment, version, browser, page, host) {
    var self =  this;

    this.ga = undefined;
    this.analyticsId = analyticsId;
    this.environment = environment;
    this.version = version;
    this.browser = browser;
    this.page = page;

    this.load = function () {
        return new Promise(function (resolve, reject) {
            Log.debug('[Service - AnalyticsService]', 'Analytics settings load requested');
            storage.getAnalytics()
                .then(function (loadedAnalytics) {
                    self.ga = analytics(self.analyticsId, loadedAnalytics.clientId);
                    Log.debug('[Service - AnalyticsService]', 'Analytics settings loaded');
                    resolve();
                    return null;
                })
                .catch(function (error) {
                    Log.error('[Service - AnalyticsService]', 'Analytics load error', error);
                    reject(error);
                    return null;
                });
        });
    };

    this.event = function (category, action, label, value) {
        self.ga.event({
            ec: category,
            ea: action,
            el: label,
            ev: value,
            cd1: self.version,
            cd2: self.browser,
            cd3: self.environment
        }).send();
    };
    
    this.exception = function (message, isFatal) {
        self.ga.exception({
            exd: message,
            exf: isFatal || false,
            cd1: self.version,
            cd2: self.browser,
            cd3: self.environment
        }).send();
    };
    
    this.pageview = function () {
        self.ga.pageview({
            dh: 'local',
            dp: self.page,
            cd1: self.version,
            cd2: self.browser,
            cd3: self.environment
        }).send();
    };    
};
