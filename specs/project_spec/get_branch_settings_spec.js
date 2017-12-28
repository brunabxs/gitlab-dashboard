var Project = require('../../app/models/project.js');
var Vcs = require('../../app/models/project.js');

describe('Project getBranchSettings function', function () {
    var vcs;

    var branchesSettings = [{ id: '123' }, { id: '456' }];

    beforeEach(function () {
        vcs = new Vcs();
        project = new Project(vcs, 1, 'name1', 'url1', true, { id: 1, branches: branchesSettings });
    });

    it('must return the branch setting with the given id', function () {
        // Arrange
        var expected = branchesSettings[1];

        // Act
        var actual = project._getBranchSettings('456');

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must remove the branch setting with the given id', function () {
        // Arrange
        var expected = [branchesSettings[0]];

        // Act
        project._getBranchSettings('456');

        // Assert
        expect(project.settings.branches).toEqual(expected);
    });

    it('must return undefined if no branch setting is found with the given id', function () {
        // Arrange
        var expected = undefined;

        // Act
        var actual = project._getBranchSettings('111');

        // Assert
        expect(actual).toEqual(expected);
    });
});
