var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemand = require('../../app/models/on_demand.js');

describe('OnDemand update function', function () {
    var onDemand;
    var updatePromiseStub;
    var clock;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemand = new OnDemand(updatePromiseStub);
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemand.update(done);

        // Assert
        expect(updatePromiseStub.called).toBeTruthy();
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemand.update(done);

        // Assert
        var actual = onDemand._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise resolves', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        onDemand.update(done);

        // Assert
        var actual = onDemand._lock;
        expect(actual).toBeTruthy();
    });

    it('must release lock when update promise rejects', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.rejects();

        // Act
        onDemand.update(done);

        // Assert
        var actual = onDemand._lock;
        expect(actual).toBeTruthy();
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemand._lock = true;
        
        // Act
        onDemand.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    xit('must call update promise again after 3000 seconds', function () {
        // Arrange
        
        // Act

        // Assert
    });
});
