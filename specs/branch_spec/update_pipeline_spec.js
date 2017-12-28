var sinon = require('sinon');

var Branch = require('../../app/models/branch.js');
var Pipeline = require('../../app/models/pipeline.js');
var Vcs = require('../../app/models/vcs.js');

describe('Branch updatePipeline function', function () {
    var vcs;
    var getRecentPipelineStub;
    var getRecentJobStub;
    var branch;

    var projectId = 123;
    var branchId = 'name1';
    var expectedError = new Error('error');
    var rawPipeline = { id: 123, status: 'status' };
    var rawJob = { id: 456, pipeline: rawPipeline, stage: 'stage', commit: { short_id: 'commit' } };
    var pipeline = new Pipeline(vcs, rawJob.pipeline.id, rawJob.stage, rawJob.pipeline.status, rawJob.commit.short_id, '');

    beforeEach(function () {
        vcs = new Vcs();
        getRecentPipelineStub = sinon.stub(vcs, 'getRecentPipeline');
        getRecentJobStub = sinon.stub(vcs, 'getRecentJob');
        branch = new Branch(vcs, projectId, branchId, 'name1', true);
    });

    it('must only update pipeline if both pipeline and job could be retrieved', function (done) {
        // Arrange
        getRecentPipelineStub
            .withArgs(projectId, branchId)
            .resolves(rawPipeline);
        getRecentJobStub
            .withArgs(projectId, rawPipeline.id, rawPipeline.status)
            .resolves(rawJob);

        // Act
        var promise = branch._updatePipeline();

        // Assert
        promise
            .then(function () {
                expect(getRecentPipelineStub.called).toBeTruthy();
                expect(getRecentJobStub.called).toBeTruthy();
                expect(branch.currentPipeline.get().id).toEqual(pipeline.id);
                expect(branch.currentPipeline.get().stage).toEqual(pipeline.stage);
                expect(branch.currentPipeline.get().status).toEqual(pipeline.status);
                expect(branch.currentPipeline.get().commit).toEqual(pipeline.commit);
                expect(branch.currentPipeline.get().url).toEqual(pipeline.url);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must not update pipeline if pipeline could not be retrieved', function (done) {
        // Arrange
        var expectedPipeline = branch.currentPipeline.get();
        getRecentPipelineStub
            .rejects(expectedError);

        // Act
        var promise = branch._updatePipeline();

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                var actual = branch.currentPipeline.get();
                expect(actual).toEqual(expectedPipeline);
                expect(getRecentJobStub.called).toBeFalsy();
            })
            .finally(done);
    });

    it('must return the error if any occurs when retrieving job from vcs', function (done) {
        // Arrange
        getRecentPipelineStub
            .rejects(expectedError);


        // Act
        var promise = branch._updatePipeline();

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
            })
            .finally(done);
    });

    it('must not update pipeline if job could not be retrieved', function (done) {
        // Arrange
        var expectedPipeline = branch.currentPipeline.get();
        getRecentPipelineStub
            .resolves(rawPipeline);
        getRecentJobStub
            .rejects(expectedError);

        // Act
        var promise = branch._updatePipeline();

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                var actual = branch.currentPipeline.get();
                expect(actual).toEqual(expectedPipeline);
            })
            .finally(done);
    });

    it('must return the error if any occurs when retrieving job from vcs', function (done) {
        // Arrange
        getRecentPipelineStub
            .resolves(rawPipeline);
        getRecentJobStub
            .rejects(expectedError);

        // Act
        var promise = branch._updatePipeline();

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
            })
            .finally(done);
    });
});
