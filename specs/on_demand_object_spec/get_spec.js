var sinon = require('sinon');

var OnDemandObject = require('../../app/models/on_demand_object.js');

describe('OnDemandObject get function', function () {
    var onDemandObject;

    beforeEach(function () {
        onDemandObject = new OnDemandObject(sinon.stub());
    });

    it('must return _object', function () {
        // Arrange
        var expected = onDemandObject._object;

        // Act
        var actual = onDemandObject.get();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must set _isUsed to true', function () {
        // Act
        onDemandObject.get();

        // Assert
        var actual = onDemandObject._isUsed;
        expect(actual).toBeTruthy();
    });
});
