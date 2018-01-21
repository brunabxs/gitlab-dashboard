var analytics = require('universal-analytics');

var Analytics = function (googleAnalyticsId, browser, version, page) {
    this.browser = browser;
    this.version = version;
    this.page = page;
    this.ga = analytics(googleAnalyticsId);
};

Analytics.prototype.event = function (category, action, label, value) {
    var self = this;
    self.ga.event({
        ec: category,
        ea: action,
        el: label,
        ev: value,
        dp: self.page,
        cd1: self.version,
        cd2: self.browser
    }).send();
};

Analytics.prototype.exception = function (message, isFatal) {
    var self = this;
    self.ga.exception({
        exd: message,
        exf: isFatal || false,
        dp: self.page,
        cd1: self.version,
        cd2: self.browser
    }).send();
};

Analytics.prototype.pageview = function () {
    var self = this;
    self.ga.pageview({
        dh: 'local',
        dp: self.page,
        cd1: self.version,
        cd2: self.browser
    }).send();
};

module.exports = Analytics;
