var Project = require('../../app/models/project.js');

describe('Project constructor', function () {
    var vcs;

    var projectId = 1;
    var projectName = 'name';
    var projectUrl = 'url';
    var projectVisible = true;
    var projectSettings = { id: projectId };

    it('must set project id', function () {
        // Act
        var project = new Project(vcs, projectId, projectName, projectUrl, projectVisible, projectSettings);

        // Assert
        var actual = project.id;
        expect(actual).toEqual(projectId);
    });

    it('must set project name', function () {
        // Act
        var project = new Project(vcs, projectId, projectName, projectUrl, projectVisible, projectSettings);

        // Assert
        var actual = project.name;
        expect(actual).toEqual(projectName);
    });

    it('must set project url', function () {
        // Act
        var project = new Project(vcs, projectId, projectName, projectUrl, projectVisible, projectSettings);

        // Assert
        var actual = project.url;
        expect(actual).toEqual(projectUrl);
    });

    it('must set project visibility if it is given', function () {
        // Act
        var project = new Project(vcs, projectId, projectName, projectUrl, projectVisible, projectSettings);

        // Assert
        var actual = project.visible;
        expect(actual).toBeTruthy();
    });

    it('must set project settings if it is given', function () {
        // Act
        var project = new Project(vcs, projectId, projectName, projectUrl, projectVisible, projectSettings);

        // Assert
        var actual = project.settings;
        expect(actual).toEqual(projectSettings);
    });

    it('must set project visibility to false by default', function () {
        // Act
        var project = new Project(vcs, 1, 'name', 'url');

        // Assert
        var actual = project.visible;
        expect(actual).toBeFalsy();
    });

    it('must set project settings to empty object by default', function () {
        // Act
        var project = new Project(vcs, 1, 'name', 'url', true);

        // Assert
        var actual = project.settings;
        expect(actual).toEqual({});
    });

    // TODO (brunabxs): check if branches attribute is initialized too
});
