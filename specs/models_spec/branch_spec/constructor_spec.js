var Branch = require('../../../app/models/branch.js');

describe('Branch constructor', function () {
    var vcs;

    var projectId = 123;
    var branchId = 'name';
    var branchName = 'name';
    var branchVisible = true;
    var branchSettings = { id: branchId };

    it('must set branch project id', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName, branchVisible, branchSettings);

        // Assert
        var actual = branch.projectId;
        expect(actual).toEqual(projectId);
    });

    it('must set branch id', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName, branchVisible, branchSettings);

        // Assert
        var actual = branch.id;
        expect(actual).toEqual(branchId);
    });

    it('must set branch name', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName, branchVisible, branchSettings);

        // Assert
        var actual = branch.name;
        expect(actual).toEqual(branchName);
    });

    it('must set branch visibility if it is given', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName, branchVisible, branchSettings);

        // Assert
        var actual = branch.visible;
        expect(actual).toBeTruthy();
    });

    it('must set branch settings if it is given', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName, branchVisible, branchSettings);

        // Assert
        var actual = branch.settings;
        expect(actual).toEqual(branchSettings);
    });

    it('must set branch visibility to false by default', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName);

        // Assert
        var actual = branch.visible;
        expect(actual).toBeFalsy();
    });

    it('must set branch settings to empty object by default', function () {
        // Act
        var branch = new Branch(vcs, projectId, branchId, branchName);

        // Assert
        var actual = branch.settings;
        expect(actual).toEqual({});
    });

    // TODO (brunabxs): check if currentPipeline attribute is initialized too
    // TODO (brunabxs): check if openedMergeRequests attribute is initialized too
});
