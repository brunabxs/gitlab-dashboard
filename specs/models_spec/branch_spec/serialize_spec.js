var Branch = require('../../../app/models/branch.js');
var Vcs = require('../../../app/models/vcs.js');

describe('Branch serialize function', function () {
    var vcs;
    var visibleBranch;
    var notVisibleBranch;

    var projectId = 123;
    var visibleBranchId = 'name1';
    var notVisibleBranchId = 'name2';

    beforeEach(function () {
        vcs = new Vcs();
        visibleBranch = new Branch(vcs, projectId, visibleBranchId, 'name1', true);
        notVisibleBranch = new Branch(vcs, projectId, notVisibleBranchId, 'name1', false);
    });

    it('must return object with id only if branch is visible', function () {
        // Arrange
        var expected = { id: visibleBranchId };

        // Act
        var actual = visibleBranch.serialize();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('must return undefined if branch is visible', function () {
        // Arrange
        var expected = undefined;

        // Act
        var actual = notVisibleBranch.serialize();

        // Assert
        expect(actual).toEqual(expected);
    });
});
