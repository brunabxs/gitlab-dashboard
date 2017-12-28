var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray add function', function () {
    var onDemandArray;

    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };

    beforeEach(function () {
        onDemandArray = new OnDemandArray(1);
    });

    it('must insert the given element in _array', function () {
        // Act
        onDemandArray.add(item1);

        // Assert
        var actual = onDemandArray.list();
        expect(actual).toEqual([item1]);
    });

    it('must insert elements in order', function () {
        // Act
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);

        // Assert
        var actual = onDemandArray.list();
        expect(actual).toEqual([item1, item2, item3]);
    });
});
