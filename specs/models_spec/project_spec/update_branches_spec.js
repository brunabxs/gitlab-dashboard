var _ = require('underscore');
var sinon = require('sinon');

var Branch = require('../../../app/models/branch.js');
var Project = require('../../../app/models/project.js');
var Vcs = require('../../../app/models/vcs.js');

describe('Project updateBranches function', function () {
    var vcs;
    var getBranchesStub;
    var project;
    var getBranchSettingsStub;

    var projectId = 1;
    var expectedError = new Error('error');
    var rawBranch1 = { name: 'name123' };
    var rawBranch2 = { name: 'name456' };
    var rawBranch3 = { name: 'name789' };
    var rawBranch4 = { name: 'name999' };
    var branch1 = new Branch(vcs, projectId, rawBranch1.name, rawBranch1.name);
    var branch2 = new Branch(vcs, projectId, rawBranch2.name, rawBranch2.name);
    var branch3 = new Branch(vcs, projectId, rawBranch3.name, rawBranch3.name);
    var branch4 = new Branch(vcs, projectId, rawBranch4.name, rawBranch4.name);

    beforeEach(function () {
        vcs = new Vcs();
        getBranchesStub = sinon.stub(vcs, 'getBranches');
        project = new Project(vcs, projectId, 'name1', 'url1', true);
        getBranchSettingsStub = sinon.stub(project, '_getBranchSettings');
    });

    it('must only add branches that were not added before', function (done) {
        // Arrange
        var expected = [branch4, branch2, branch1, branch3];
        project.branches.add(branch4);
        project.branches.add(branch2);
        getBranchesStub
            .resolves([rawBranch1, rawBranch2, rawBranch3, rawBranch4]);

        // Act
        var promise = project._updateBranches();

        // Assert
        promise
            .then(function () {
                expect(project.branches.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(project.branches.get(i).projectId).toEqual(expected[i].projectId);
                    expect(project.branches.get(i).id).toEqual(expected[i].id);
                    expect(project.branches.get(i).name).toEqual(expected[i].name);
                    expect(project.branches.get(i).url).toEqual(expected[i].url);
                }                
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must retrieve the branch settings for branch', function (done) {
        // Arrange
        project.branches.add(branch4);
        project.branches.add(branch2);
        getBranchesStub
            .resolves([rawBranch1, rawBranch2, rawBranch3, rawBranch4]);

        // Act
        var promise = project._updateBranches();

        // Assert
        promise
            .then(function () {
                expect(getBranchSettingsStub.callCount).toEqual(4);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must remove branches that were not retrieved', function (done) {
        // Arrange
        var expected = [branch3, branch1];
        project.branches.add(branch4);
        project.branches.add(branch3);
        project.branches.add(branch2);
        project.branches.add(branch1);
        getBranchesStub
            .resolves([rawBranch1, rawBranch3]);

        // Act
        var promise = project._updateBranches();

        // Assert
        promise
            .then(function () {
                expect(project.branches.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(project.branches.get(i).projectId).toEqual(expected[i].projectId);
                    expect(project.branches.get(i).id).toEqual(expected[i].id);
                    expect(project.branches.get(i).name).toEqual(expected[i].name);
                    expect(project.branches.get(i).url).toEqual(expected[i].url);
                }
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must return the error if any occurs when retrieving branches from vcs', function (done) {
        // Arrange
        getBranchesStub
            .withArgs(1)
            .rejects(expectedError);

        // Act
        var promise = project._updateBranches();

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
