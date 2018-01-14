var OnDemandArray = require('../../../app/models/on_demand_array.js');

describe('OnDemandArray length function', function () {
    var item = { 'name': 'a' };

    it('must return the current number of elements', function () {
        // Arrange
        var onDemandArray = new OnDemandArray(1);
        onDemandArray.add(item);
        onDemandArray.add(item);

        // Act
        var actual = onDemandArray.length();

        // Assert
        expect(actual).toEqual(2);
    });
});
