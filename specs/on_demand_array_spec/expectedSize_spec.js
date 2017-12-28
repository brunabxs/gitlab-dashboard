var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray expectedSize function', function () {
    var onDemandArray;

    var initialExpectedSize = 123;
    var redefinedExpectedSize = 456;

    beforeEach(function () {
        onDemandArray = new OnDemandArray(initialExpectedSize);
    });

    it('must return the initial expected size if no value is given', function () {
        // Act
        var actual = onDemandArray.expectedSize();

        // Assert
        expect(actual).toEqual(initialExpectedSize);
    });

    it('must redefine the expected size if some value is given', function () {
        // Act
        var actual = onDemandArray.expectedSize(redefinedExpectedSize);

        // Assert
        expect(actual).toEqual(redefinedExpectedSize);
    });
});
