var _ = require('underscore');

var OnDemand = require('./on_demand.js');

var OnDemandObject = function (updatePromise) {
    this._object = undefined;
    this._isUsed = false;

    OnDemand.call(this, updatePromise);
};

OnDemandObject.prototype = Object.create(OnDemand.prototype);
OnDemandObject.prototype.constructor = OnDemandObject;

OnDemandObject.prototype.set = function (object) {
    this._object = object;
};

OnDemandObject.prototype.get = function () {
    this._isUsed = true;
    return this._object;
};

OnDemandObject.prototype.getAndUpdate = function () {
    this.update();
    return this.get();
};

module.exports = OnDemandObject;
