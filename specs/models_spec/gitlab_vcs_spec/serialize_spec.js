var sinon = require('sinon');

var GitlabVcs = require('../../../app/models/gitlab_vcs.js');

describe('Gitlab Vcs serialize function', function () {
    var projectsSerializeStub;

    var vcs = new GitlabVcs('name', 'http://endpoint', 'token');

    beforeEach(function () {
        projectsSerializeStub = sinon.stub(vcs.projects, 'serialize').returns('serializedProjects');
    });

    it('must return object with type, name, endpoint, token and serialized projects', function () {
        // Arrange
        var expected = { name: 'name', type: 'gitlab', settings: { endpoint: 'http://endpoint', token: 'token' }, projects: 'serializedProjects' };

        // Act
        var actual = vcs.serialize();

        // Assert
        expect(actual).toEqual(expected);
        expect(projectsSerializeStub.called).toBeTruthy();
    });
});
