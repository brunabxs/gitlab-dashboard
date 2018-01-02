var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemand = require('../../app/models/on_demand.js');

describe('OnDemand update function', function () {
    var clock;
    var onDemand;
    var updatePromiseStub;
    var updateSpy;

    var updateFrequencySec = 5;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemand = new OnDemand(updatePromiseStub, updateFrequencySec);
        updateSpy = sinon.spy(onDemand, 'update');
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemand.update();

        // Assert
        promise.finally(function () {
            expect(updatePromiseStub.called).toBeTruthy();
            done();
        });
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemand.update();

        // Assert
        promise.finally(function () {
            var actual = onDemand._lock;
            expect(actual).toBeTruthy();
            done();
        });
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemand._lock = true;

        // Act
        onDemand.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    it('must call update promise again some seconds after first update promise resolves', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemand.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });

    it('must call update promise again some seconds after first update promise rejects', function (done) {
        // Arrange
        onDemand._lock = false;
        updatePromiseStub.rejects();

        // Act
        var promise = onDemand.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });
});
