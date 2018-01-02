var OnDemand = function (updatePromise, updateFrequencySec) {
    this._lock = false;
    this._updatePromise = updatePromise;
    this._updateFrequencyMs = (updateFrequencySec || 3) * 1000;
};

OnDemand.prototype.update = function () {
    var self = this;

    if (self._lock) return;
    self._lock = true;
    return self._updatePromise()
        .finally(function () {
            setTimeout(function () {
                self._lock = false;
                return self.update();
            }, self._updateFrequencyMs);
        });
};

module.exports = OnDemand;
