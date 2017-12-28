var sinon = require('sinon');

var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray serialize function', function () {
    var onDemandArray;
    
    var item1 = { serialize: sinon.stub().returns('serializedItem1') };
    var item2 = { serialize: sinon.stub().returns(undefined) };
    var item3 = { serialize: sinon.stub().returns('serializedItem3') };
    

    beforeEach(function () {
        onDemandArray = new OnDemandArray(1);
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
    });

    it('must return only serialized items', function () {
        // Arrange
        var expected = ['serializedItem1', 'serializedItem3'];

        // Act
        var actual = onDemandArray.serialize();

        // Assert
        expect(actual).toEqual(expected);
    });
});
