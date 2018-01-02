var bluebird = require('bluebird');
var sinon = require('sinon');

var OnDemandArray = require('../../app/models/on_demand_array.js');

describe('OnDemandArray update function', function () {
    var clock;
    var onDemandArray;
    var updatePromiseStub;
    var updateSpy;

    var updateFrequencySec = 5;
    var item1 = { 'name': 'a' };
    var item2 = { 'name': 'b' };
    var item3 = { 'name': 'c' };

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        updatePromiseStub = sinon.stub().usingPromise(bluebird.Promise);
        onDemandArray = new OnDemandArray(1, updatePromiseStub, updateFrequencySec);
        onDemandArray.add(item1);
        onDemandArray.add(item2);
        onDemandArray.add(item3);
        updateSpy = sinon.spy(onDemandArray, 'update');
    });

    afterEach(function () {
        clock.restore();
    });

    it('must call update promise if it is not locked', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandArray.update();

        // Assert
        promise.finally(function () {
            expect(updatePromiseStub.called).toBeTruthy();
            done();
        });
    });

    it('must lock if it is not locked', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandArray.update();

        // Assert
        promise.finally(function () {
            var actual = onDemandArray._lock;
            expect(actual).toBeTruthy();
            done();
        });
    });

    it('must not call update promise if it is locked', function () {
        // Arrange
        onDemandArray._lock = true;

        // Act
        onDemandArray.update();

        // Assert
        expect(updatePromiseStub.called).toBeFalsy();
    });

    it('must call update promise again some seconds after first update promise resolves', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.resolves();

        // Act
        var promise = onDemandArray.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });

    it('must call update promise again some seconds after first update promise rejects', function (done) {
        // Arrange
        onDemandArray._lock = false;
        updatePromiseStub.rejects();

        // Act
        var promise = onDemandArray.update();

        // Assert
        promise.finally(function () {
            clock.tick(updateFrequencySec * 1000);
            expect(updateSpy.callCount).toEqual(2);
            done();
        });
    });
});
