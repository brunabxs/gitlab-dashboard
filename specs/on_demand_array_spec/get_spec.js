var sinon = require('sinon');

var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray get function', function () {
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

    it('must return element at the given position', function () {
        // Arrange
        var expected = item2;

        // Act
        var actual = onDemandArray.get(1);

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must not return any element if there is no element at the given position', function () {
        // Arrange
        var expected;

        // Act
        var actual = onDemandArray.get(onDemandArray.length());

        // Assert
        expect(actual).toEqual(expected);
    });
});
