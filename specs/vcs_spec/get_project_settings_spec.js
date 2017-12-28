var Vcs = require('../../app/models/vcs.js');

describe('Vcs getProjectSettings function', function () {
    var vcs;

    var projectsSettings = [{ id: '123' }, { id: '456' }];

    beforeEach(function () {
        vcs = new Vcs(projectsSettings);
    });

    it('must return the project setting with the given id', function () {
        // Arrange
        var expected = projectsSettings[1];

        // Act
        var actual = vcs._getProjectSettings('456');

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must remove the project setting with the given id', function () {
        // Arrange
        var expected = [projectsSettings[0]];

        // Act
        vcs._getProjectSettings('456');

        // Assert
        expect(vcs.projectsSettings).toEqual(expected);
    });

    it('must return undefined if no project setting is found with the given id', function () {
        // Arrange
        var expected = undefined;

        // Act
        var actual = vcs._getProjectSettings('111');

        // Assert
        expect(actual).toEqual(expected);
    });
});
