var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemandObject = require('../../app/models/on_demand_object.js');

describe('OnDemandObject update function', function () {
    var onDemandObject;
    var updatePromiseStub;
    var clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemandObject = new OnDemandObject(updatePromiseStub);
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandObject.update(done);

        // Assert
        expect(updatePromiseStub.called).toBeTruthy();
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandObject.update(done);

        // Assert
        var actual = onDemandObject._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise resolves', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemandObject.update(done);

        // Assert
        var actual = onDemandObject._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise rejects', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.rejects();

        // Act
        onDemandObject.update(done);

        // Assert
        var actual = onDemandObject._lock;
        expect(actual).toBeTruthy();
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemandObject._lock = true;
        
        // Act
        onDemandObject.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    xit('must call update promise again after 3000 seconds', function () {
        // Arrange
        
        // Act

        // Assert
    });
});
