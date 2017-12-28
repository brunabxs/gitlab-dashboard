var sinon = require('sinon');

var OnDemandObject = require('../../app/models/on_demand_object.js');

describe('OnDemandObject getAndUpdate function', function () {
    var onDemandObject;
    var getStub, updateStub;

    var getReturn = { 'name': 'a' };

    beforeEach(function () {
        onDemandObject = new OnDemandObject(1, sinon.stub());
        getStub = sinon.stub(onDemandObject, 'get').callsFake(function () { return getReturn; });
        updateStub = sinon.stub(onDemandObject, 'update');
    });

    it('must call get', function () {
        // Act
        onDemandObject.getAndUpdate();

        // Assert
        expect(getStub.called).toBeTruthy();
    });

    it('must call update', function () {
        // Act
        onDemandObject.getAndUpdate();

        // Assert
        expect(updateStub.called).toBeTruthy();
    });

    it('must return get', function () {
        // Act
        var actual = onDemandObject.getAndUpdate();

        // Assert
        expect(actual).toEqual(getReturn);
    });
});
