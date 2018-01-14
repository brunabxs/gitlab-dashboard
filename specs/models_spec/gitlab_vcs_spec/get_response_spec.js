var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request-promise');
var sinon = require('sinon');

var Project = require('../../../app/models/project.js');
var GitlabVcs = require('../../../app/models/gitlab_vcs.js');

describe('Gitlab Vcs getResponse function', function () {
    var getStub;
    var headStub;
    var postStub;

    var vcs = new GitlabVcs('name', 'http://endpoint', 'token');
    var defaultResponse = Promise.resolve({ headers: {}, body: JSON.stringify({}) });
    var expectedError = new Error('error');

    beforeEach(function () {
        getStub = sinon.stub(request, 'get');
        headStub = sinon.stub(request, 'head');
        postStub = sinon.stub(request, 'post');
    });

    afterEach(function () {
        getStub.restore();
        headStub.restore();
        postStub.restore();
    });

    it('must call GET http method by default', function (done) {
        // Arrange
        getStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path');

        // Assert
        promise
            .then(function () {
                expect(getStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must call HEAD http method if post method is selected', function (done) {
        // Arrange
        headStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path', 'HEAD');

        // Assert
        promise
            .then(function () {
                expect(headStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must call POST http method if post method is selected', function (done) {
        // Arrange
        postStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path', 'POST');

        // Assert
        promise
            .then(function () {
                expect(postStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must return the error if no http method is found', function (done) {
        // Arrange
        var expectedError = new TypeError('httpAction is not a function');
        postStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path', 'KAJSKAJSK');

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

    it('must return the error if any when requesting to some endpoint', function (done) {
        // Arrange
        postStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path', 'KAJSKAJSK');

        // Assert
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

    it('must set endpoint and path uri', function (done) {
        // Arrange
        getStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path');

        // Assert
        promise
            .then(function () {
                expect(getStub.lastCall.args[0].uri).toEqual('http://endpoint/path');
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must set private-token in headers', function (done) {
        // Arrange
        getStub
            .returns(defaultResponse);

        // Act
        var promise = vcs.getResponse('/path');

        // Assert
        promise
            .then(function () {
                expect(getStub.lastCall.args[0].headers['PRIVATE-TOKEN']).toEqual('token');
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });
});
