var sinon = require('sinon');

var OnDemandArray = require('../../../app/models/on_demand_array.js');

describe('OnDemandArray list function', function () {
    var onDemandArray;

    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };

    beforeEach(function () {
        onDemandArray = new OnDemandArray(1, sinon.stub());
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
    });

    it('must return all elements of _array', function () {
        // Arrange
        var expected = onDemandArray._array;

        // Act
        var actual = onDemandArray.list();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must set _isUsed to true', function () {
        // Act
        onDemandArray.list();

        // Assert
        var actual = onDemandArray._isUsed;
        expect(actual).toBeTruthy();
    });
});
