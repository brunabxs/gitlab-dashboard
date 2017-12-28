var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray update function', function () {
    var onDemandArray;
    var updatePromiseStub;
    var clock;

    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemandArray = new OnDemandArray(1, updatePromiseStub);
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandArray.update(done);

        // Assert
        expect(updatePromiseStub.called).toBeTruthy();
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandArray.update(done);

        // Assert
        var actual = onDemandArray._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise resolves', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandArray.update(done);

        // Assert
        var actual = onDemandArray._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise rejects', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.rejects();

        // Act
        onDemandArray.update(done);

        // Assert
        var actual = onDemandArray._lock;
        expect(actual).toBeTruthy();
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemandArray._lock = true;
        
        // Act
        onDemandArray.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    xit('must call update promise again after 3000 seconds', function () {
        // Arrange
        
        // Act

        // Assert
    });
});
