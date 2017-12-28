var sinon = require('sinon');

var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray listAndUpdate function', function () {
    var onDemandArray;
    var listStub, updateStub;

    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };
    var listReturn = [item1, item2, item3];

    beforeEach(function () {
        onDemandArray = new OnDemandArray(1, sinon.stub());
        listStub = sinon.stub(onDemandArray, 'list').callsFake(function () { return listReturn; });
        updateStub = sinon.stub(onDemandArray, 'update');
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
    });

    it('must call list', function () {
        // Act
        onDemandArray.listAndUpdate();

        // Assert
        expect(listStub.called).toBeTruthy();
    });

    it('must call update', function () {
        // Act
        onDemandArray.listAndUpdate();

        // Assert
        expect(updateStub.called).toBeTruthy();
    });

    it('must return list', function () {
        // Act
        var actual = onDemandArray.listAndUpdate();

        // Assert
        expect(actual).toEqual(listReturn);
    });
});
