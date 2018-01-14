var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request-promise');
var sinon = require('sinon');

var Project = require('../../../app/models/project.js');
var GitlabVcs = require('../../../app/models/gitlab_vcs.js');

xdescribe('Gitlab Vcs getResponsesFromMultiplePages function', function () {
    var getResponseStub;

    var vcs = new GitlabVcs('name', 'http://endpoint', 'token');
    var expectedError = new Error('error');
    var defaultResponse = Promise.resolve({ headers: {}, body: JSON.stringify({}) });
    var errorResponse = Promise.reject(expectedError);

    beforeEach(function () {
        getResponseStub = sinon.stub(vcs, 'getResponse');
    });

    afterEach(function () {
        getResponseStub.restore();
    });

    it('must call getResponse twice if total pages is 1', function (done) {
        // Arrange
        getResponseStub
            .onCall(0)
            .returns(Promise.resolve({
                headers: {
                    'x-total-pages': 1
                },
                body: JSON.stringify({})
            }))
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponsesFromMultiplePages('/path');

        // Assert
        promise
            .then(function () {
                expect(getResponseStub.calledTwice).toBeTruthy();
                expect(getResponseStub.firstCall.args).toEqual(['/path', 'HEAD']);
                expect(getResponseStub.secondCall.args).toEqual(['/path?page=1']);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must call getResponse three times if total pages is 2', function (done) {
        // Arrange
        getResponseStub
            .onCall(0)
            .returns(Promise.resolve({
                headers: {
                    'x-total-pages': 2
                },
                body: JSON.stringify({})
            }))
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponsesFromMultiplePages('/path');

        // Assert
        promise
            .then(function () {
                expect(getResponseStub.calledThrice).toBeTruthy();
                expect(getResponseStub.firstCall.args).toEqual(['/path', 'HEAD']);
                expect(getResponseStub.secondCall.args).toEqual(['/path?page=1']);
                expect(getResponseStub.thirdCall.args).toEqual(['/path?page=2']);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must call correct path if it already contains a query', function (done) {
        // Arrange
        getResponseStub
            .onCall(0)
            .returns(Promise.resolve({
                headers: {
                    'x-total-pages': 1
                },
                body: JSON.stringify({})
            }))
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponsesFromMultiplePages('/path?q=teste');

        // Assert
        promise
            .then(function () {
                expect(getResponseStub.calledTwice).toBeTruthy();
                expect(getResponseStub.firstCall.args).toEqual(['/path?q=teste', 'HEAD']);
                expect(getResponseStub.secondCall.args).toEqual(['/path?q=teste&page=1']);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    xit('must return the error if any when requesting to some endpoint', function (done) {
        // Arrange
        getResponseStub
            .onCall(0)
            .returns(Promise.resolve({
                headers: {
                    'x-total-pages': 2
                },
                body: JSON.stringify({})
            }))
            .onCall(1)
                .returns(defaultResponse)
            .onCall(2)
                .returns(errorResponse)
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponsesFromMultiplePages('/path?q=teste');

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
