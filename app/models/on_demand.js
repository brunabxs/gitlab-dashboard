var _ = require('underscore');

var OnDemand = function (updatePromise) {
    this._lock = false;
    this._updatePromise = updatePromise;
};

OnDemand.prototype.update = function (callback) {
    var self = this;

    if (self._lock) return;
    self._lock = true;
    self._updatePromise()
        .finally(function () {
            self._lock = false;
            setTimeout(function () { return self.update(callback); }, 3000);
            if (callback) {
                callback();
            }
        });
};

module.exports = OnDemand;
