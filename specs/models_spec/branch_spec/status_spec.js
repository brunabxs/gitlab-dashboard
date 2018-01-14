var sinon = require('sinon');

var Branch = require('../../../app/models/branch.js');
var Vcs = require('../../../app/models/vcs.js');

describe('Branch status function', function () {
    var vcs;
    var branch;
    var getAndUpdateCurrentPipelineStub;

    beforeEach(function () {
        vcs = new Vcs();
        branch = new Branch(vcs, 123, 'name1', 'name1');
        getAndUpdateCurrentPipelineStub = sinon.stub(branch.currentPipeline, 'getAndUpdate');
    });

    it('must return current pipeline status if it exists', function () {
        // Arrange
        var expected = 'expectedStatus';
        getAndUpdateCurrentPipelineStub.returns({
            status: expected
        });

        // Act
        var actual = branch.status();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must return "unavailable" if current pipeline does not exist', function () {
        // Arrange
        var expected = 'unavailable';
        getAndUpdateCurrentPipelineStub.returns(undefined);

        // Act
        var actual = branch.status();

        // Assert
        expect(actual).toEqual(expected);
    });
});
