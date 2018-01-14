var sinon = require('sinon');

var Project = require('../../../app/models/project.js');
var Vcs = require('../../../app/models/vcs.js');

describe('Project serialize function', function () {
    var vcs;
    var visibleProject;
    var notVisibleProject;

    var visibleProjectId = 1;
    var notVisibleProjectId = 2;

    beforeEach(function () {
        vcs = new Vcs();
        visibleProject = new Project(vcs, visibleProjectId, 'name1', 'url1', true);
        visibleProjectBranchesSerializeStub = sinon.stub(visibleProject.branches, 'serialize').returns('serializedBranches');
        notVisibleProject = new Project(vcs, notVisibleProjectId, 'name1', 'url1', false);
        notVisibleProjectBranchesSerializeStub = sinon.stub(notVisibleProject.branches, 'serialize');
    });

    it('must return object with id and serialized branches if project is visible', function () {
        // Arrange
        var expected = { id: visibleProjectId, branches: 'serializedBranches' };

        // Act
        var actual = visibleProject.serialize();

        // Assert
        expect(actual).toEqual(expected);
        expect(visibleProjectBranchesSerializeStub.called).toBeTruthy();
    });

    it('must return undefined if project is visible', function () {
        // Arrange
        var expected = undefined;

        // Act
        var actual = notVisibleProject.serialize();

        // Assert
        expect(actual).toEqual(expected);
        expect(notVisibleProjectBranchesSerializeStub.called).toBeFalsy();
    });
});
