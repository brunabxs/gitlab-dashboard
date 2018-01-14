var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemandObject = require('../../../app/models/on_demand_object.js');

describe('OnDemandObject update function', function () {
    var clock;
    var onDemandObject;
    var updatePromiseStub;
    var updateSpy;

    var updateFrequencySec = 5;

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemandObject = new OnDemandObject(updatePromiseStub, updateFrequencySec);
        updateSpy = sinon.spy(onDemandObject, 'update');
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandObject.update();

        // Assert
        promise.finally(function () {
            expect(updatePromiseStub.called).toBeTruthy();
            done();
        });
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandObject.update();

        // Assert
        promise.finally(function () {
            var actual = onDemandObject._lock;
            expect(actual).toBeTruthy();
            done();
        });
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemandObject._lock = true;

        // Act
        onDemandObject.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    it('must call update promise again some seconds after first update promise resolves', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandObject.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });

    it('must call update promise again some seconds after first update promise rejects', function (done) {
        // Arrange
        onDemandObject._lock = false;
        updatePromiseStub.rejects();

        // Act
        var promise = onDemandObject.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });
});
