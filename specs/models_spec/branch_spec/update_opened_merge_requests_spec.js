var sinon = require('sinon');

var Branch = require('../../../app/models/branch.js');
var MergeRequest = require('../../../app/models/merge_request.js');
var Vcs = require('../../../app/models/vcs.js');

describe('Branch updateOpenedMergeRequests function', function () {
    var vcs;
    var getOpenedMergeRequestsStub;
    var branch;

    var projectId = 123;
    var branchId = 'name1';
    var expectedError = new Error('error');
    var rawMR1 = { id: 123, target_branch: branchId, source_branch: 2, upvotes: 3, downvotes: 4, web_url: 'url' };
    var rawMR2 = { id: 456, target_branch: branchId, source_branch: 2, upvotes: 3, downvotes: 4, web_url: 'url' };
    var rawMR3 = { id: 789, target_branch: branchId, source_branch: 2, upvotes: 3, downvotes: 4, web_url: 'url' };
    var rawMR4 = { id: 999, target_branch: branchId, source_branch: 2, upvotes: 3, downvotes: 4, web_url: 'url' };
    var mergeRequest1 = new MergeRequest(vcs, rawMR1.id, rawMR1.target_branch, rawMR1.source_branch, rawMR1.upvotes, rawMR1.downvotes, rawMR1.web_url);
    var mergeRequest2 = new MergeRequest(vcs, rawMR2.id, rawMR2.target_branch, rawMR2.source_branch, rawMR2.upvotes, rawMR2.downvotes, rawMR2.web_url);
    var mergeRequest3 = new MergeRequest(vcs, rawMR3.id, rawMR3.target_branch, rawMR3.source_branch, rawMR3.upvotes, rawMR3.downvotes, rawMR3.web_url);
    var mergeRequest4 = new MergeRequest(vcs, rawMR4.id, rawMR4.target_branch, rawMR4.source_branch, rawMR4.upvotes, rawMR4.downvotes, rawMR4.web_url);

    beforeEach(function () {
        vcs = new Vcs();
        getOpenedMergeRequestsStub = sinon.stub(vcs, 'getOpenedMergeRequests');
        branch = new Branch(vcs, projectId, branchId, 'name1', true);
    });

    it('must only add merge requests that were not added before', function (done) {
        // Arrange
        var expected = [mergeRequest4, mergeRequest2, mergeRequest1, mergeRequest3];
        branch.openedMergeRequests.add(mergeRequest4);
        branch.openedMergeRequests.add(mergeRequest2);
        getOpenedMergeRequestsStub
            .withArgs(projectId, undefined, branchId)
            .resolves([rawMR1, rawMR2, rawMR3, rawMR4]);

        // Act
        var promise = branch._updateOpenedMergeRequests();

        // Assert
        promise
            .then(function () {
                expect(branch.openedMergeRequests.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(branch.openedMergeRequests.get(i).id).toEqual(expected[i].id);
                    expect(branch.openedMergeRequests.get(i).sourceBranchId).toEqual(expected[i].sourceBranchId);
                    expect(branch.openedMergeRequests.get(i).targetBranchId).toEqual(expected[i].targetBranchId);
                    expect(branch.openedMergeRequests.get(i).upvotes).toEqual(expected[i].upvotes);
                    expect(branch.openedMergeRequests.get(i).downvotes).toEqual(expected[i].downvotes);
                    expect(branch.openedMergeRequests.get(i).url).toEqual(expected[i].url);
                }
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must remove merge requests that were not retrieved', function (done) {
        // Arrange
        var expected = [mergeRequest3, mergeRequest1];
        branch.openedMergeRequests.add(mergeRequest4);
        branch.openedMergeRequests.add(mergeRequest3);
        branch.openedMergeRequests.add(mergeRequest2);
        branch.openedMergeRequests.add(mergeRequest1);
        getOpenedMergeRequestsStub
            .resolves([rawMR1, rawMR3]);

        // Act
        var promise = branch._updateOpenedMergeRequests();

        // Assert
        promise
            .then(function () {
                expect(branch.openedMergeRequests.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(branch.openedMergeRequests.get(i).id).toEqual(expected[i].id);
                    expect(branch.openedMergeRequests.get(i).sourceBranchId).toEqual(expected[i].sourceBranchId);
                    expect(branch.openedMergeRequests.get(i).targetBranchId).toEqual(expected[i].targetBranchId);
                    expect(branch.openedMergeRequests.get(i).upvotes).toEqual(expected[i].upvotes);
                    expect(branch.openedMergeRequests.get(i).downvotes).toEqual(expected[i].downvotes);
                    expect(branch.openedMergeRequests.get(i).url).toEqual(expected[i].url);
                }
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must return the error if any occurs when retrieving branches from vcs', function (done) {
        // Arrange
        getOpenedMergeRequestsStub
            .rejects(expectedError);

        // Act
        var promise = branch._updateOpenedMergeRequests();

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
