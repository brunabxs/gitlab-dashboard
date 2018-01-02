var _ = require('underscore');

var OnDemand = require('./on_demand.js');

var OnDemandArray = function (expectedSize, updatePromise, updateFrequencySec) {
    this._expectedSize = expectedSize;
    this._array = [];
    this._isUsed = false;

    OnDemand.call(this, updatePromise, updateFrequencySec);
};

OnDemandArray.prototype = Object.create(OnDemand.prototype);
OnDemandArray.prototype.constructor = OnDemandArray;

OnDemandArray.prototype.expectedSize = function (value) {
    if (value !== undefined)
        this._expectedSize = value;
    return this._expectedSize;
};

OnDemandArray.prototype.list = function () {
    this._isUsed = true;
    return this._array;
};

OnDemandArray.prototype.get = function (index) {
    return this._array[index];
};

OnDemandArray.prototype.listAndUpdate = function (callback) {
    this.update(callback);
    return this.list();
};

OnDemandArray.prototype.add = function (item) {
    this._array.push(item);
};

OnDemandArray.prototype.remove = function (item) {
    index = _.indexOf(this._array, item);
    if (index >= 0) {
        this.removeByIndex(index);
    }
};

OnDemandArray.prototype.removeByIndex = function (index) {
    this._array.splice(index, 1);
};

OnDemandArray.prototype.length = function () {
    return this._array.length;
};

OnDemandArray.prototype.serialize = function () {
    return _.filter(_.map(this._array, function (item) {
        return item.serialize();
    }), function (item) {
        return item !== undefined;
    });
};

module.exports = OnDemandArray;
