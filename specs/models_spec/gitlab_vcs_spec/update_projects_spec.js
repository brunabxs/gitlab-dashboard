var _ = require('underscore');
var sinon = require('sinon');

var Project = require('../../../app/models/project.js');
var GitlabVcs = require('../../../app/models/gitlab_vcs.js');

describe('Gitlab Vcs updateProjects function', function () {
    var vcs;
    var getProjectsStub;
    var getProjectSettingsStub;

    var expectedError = new Error('error');
    var rawProject1 = { id: 123, name: 'name123', name_with_namespace: 'namespace / name123', web_url: 'url123' };
    var rawProject2 = { id: 456, name: 'name456', name_with_namespace: 'namespace / name456', web_url: 'url456' };
    var rawProject3 = { id: 789, name: 'name789', name_with_namespace: 'namespace / name789', web_url: 'url789' };
    var rawProject4 = { id: 999, name: 'name999', name_with_namespace: 'namespace / name999', web_url: 'url999' };
    var project1 = new Project(vcs, rawProject1.id, rawProject1.name_with_namespace, rawProject1.web_url);
    var project2 = new Project(vcs, rawProject2.id, rawProject2.name_with_namespace, rawProject2.web_url);
    var project3 = new Project(vcs, rawProject3.id, rawProject3.name_with_namespace, rawProject3.web_url);
    var project4 = new Project(vcs, rawProject4.id, rawProject4.name_with_namespace, rawProject4.web_url);

    beforeEach(function () {
        vcs = new GitlabVcs();
        getProjectsStub = sinon.stub(vcs, 'getProjects');
        getProjectSettingsStub = sinon.stub(vcs, '_getProjectSettings');
    });

    it('must only add projects that were not added before', function (done) {
        // Arrange
        var expected = [project4, project2, project1, project3];
        vcs.projects.add(project4);
        vcs.projects.add(project2);
        getProjectsStub
            .resolves([rawProject1, rawProject2, rawProject3, rawProject4]);

        // Act
        var promise = vcs._updateProjects();

        // Assert
        promise
            .then(function () {
                expect(vcs.projects.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(vcs.projects.get(i).id).toEqual(expected[i].id);
                    expect(vcs.projects.get(i).name).toEqual(expected[i].name);
                    expect(vcs.projects.get(i).url).toEqual(expected[i].url);
                    expect(vcs.projects.get(i).visible).toEqual(expected[i].visible);
                }
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must retrieve the project settings for project', function (done) {
        // Arrange
        vcs.projects.add(project4);
        vcs.projects.add(project2);
        getProjectsStub
            .resolves([rawProject1, rawProject2, rawProject3, rawProject4]);

        // Act
        var promise = vcs._updateProjects();

        // Assert
        promise
            .then(function () {
                expect(getProjectSettingsStub.callCount).toEqual(4);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must remove projects that were not retrieved', function (done) {
        // Arrange
        var expected = [project3, project1];
        vcs.projects.add(project4);
        vcs.projects.add(project3);
        vcs.projects.add(project2);
        vcs.projects.add(project1);
        getProjectsStub
            .resolves([rawProject1, rawProject3]);

        // Act
        var promise = vcs._updateProjects();

        // Assert
        promise
            .then(function () {
                expect(vcs.projects.length()).toEqual(expected.length);
                for (var i = 0; i < expected.length; ++i) {
                    expect(vcs.projects.get(i).id).toEqual(expected[i].id);
                    expect(vcs.projects.get(i).name).toEqual(expected[i].name);
                    expect(vcs.projects.get(i).url).toEqual(expected[i].url);
                    expect(vcs.projects.get(i).visible).toEqual(expected[i].visible);
                }
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must return the error if any occurs when retrieving projects from vcs', function (done) {
        // Arrange
        getProjectsStub
            .rejects(expectedError);

        // Act
        var promise = vcs._updateProjects();

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
