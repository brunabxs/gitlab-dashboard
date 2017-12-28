var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray removeByIndex function', function () {
    var onDemandArray;

    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };
    var item4 = { 'name': 'd' };

    beforeEach(function () {
        onDemandArray = new OnDemandArray(1);
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
    });

    it('must remove the element at the given position', function () {
        // Act
        onDemandArray.removeByIndex(1);

        // Assert
        actual = onDemandArray._array;
        expect(actual).toEqual([item1, item3]);
    });

    it('must not remove any element if there is no element at the given position', function () {
        // Act
        onDemandArray.removeByIndex(4);

        // Assert
        actual = onDemandArray._array;
        expect(actual).toEqual([item1, item2, item3]);
    });
});
