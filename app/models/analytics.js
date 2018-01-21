var analytics = require('universal-analytics');

var Analytics = function (googleAnalyticsId) {
    this.ga = analytics(googleAnalyticsId);
};

Analytics.prototype.set = function (key, value) {
    var self = this;
    self.ga.set(key, value);
};

Analytics.prototype.event = function (category, action, label, value) {
    var self = this;
    self.ga.event(category, action, label, value).send();
};

Analytics.prototype.exception = function (message, isFatal) {
    var self = this;
    self.ga.event(message, isFatal || false).send();
};

Analytics.prototype.pageview = function (page) {
    var self = this;
    self.ga.pageview(page).send();
};

module.exports = Analytics;
