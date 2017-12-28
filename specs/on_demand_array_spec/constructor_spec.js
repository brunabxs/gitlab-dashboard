var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray constructor', function () {
    var initialExpectedSize = 123;

    it('must set initial expected size', function () {
        // Act
        var onDemandArray = new OnDemandArray(initialExpectedSize);

        // Assert
        var actual = onDemandArray._expectedSize;
        expect(actual).toEqual(initialExpectedSize);
    });
});
