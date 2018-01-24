var Promise = require('bluebird');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

var LegacyStorageProvider = require('../../../app/providers/legacy_storage.js');
var StorageProvider = require('../../../app/providers/storage.js');

var UpdateLegacyStorage = require('../../../app/installation/update_legacy_storage.js');

describe('Update Legacy Storage update function', function () {
    var updateLegacyStorage;
    var loadLegacyStorageProviderStub;
    var getApiConfigLegacyStorageProviderStub;
    var clearLegacyStorageProviderStub;
    var loadStorageProviderStub;
    var getVcssStorageProviderStub;
    var saveVcssStorageProviderStub;

    var legacyStorageProviderStub;
    var storageProviderStub;

    var expectedError = new Error('error');
    var apiConfig = { endpoint: 'http://endpoint', token: 'token', projects_settings: { '123#develop': { visible: false }, '456#master': { visible: true } } };
    var emptyApiConfig = { endpoint: '' };
    var emptyVcss = [];
    var serializedVcs = { name: 'Gitlab API', type: 'gitlab', settings: { endpoint: 'http://endpoint', token: 'token' }, projects: [{ id: 456, branches: [{ id: 'master' }] }] };

    beforeEach(function () {
        loadLegacyStorageProviderStub = sinon.stub();
        getApiConfigLegacyStorageProviderStub = sinon.stub();
        clearLegacyStorageProviderStub = sinon.stub();
        loadStorageProviderStub = sinon.stub();
        getVcssStorageProviderStub = sinon.stub();
        saveVcssStorageProviderStub = sinon.stub();

        legacyStorageProviderStub = {
            load: loadLegacyStorageProviderStub,
            $get: function () {
                return {
                    getApiConfig: getApiConfigLegacyStorageProviderStub,
                    clear: clearLegacyStorageProviderStub,
                };
            },
        };

        storageProviderStub = {
            load: loadStorageProviderStub,
            $get: function () {
                return {
                    getVcss: getVcssStorageProviderStub,
                    saveVcss: saveVcssStorageProviderStub,
                };
            },
        };

        updateLegacyStorage = new UpdateLegacyStorage();
    });

    it('must load legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(loadLegacyStorageProviderStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must load storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(loadStorageProviderStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must retrieve api config from legacy storage and vcss from storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(getApiConfigLegacyStorageProviderStub.called).toBeTruthy();
                expect(getVcssStorageProviderStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must save vcss if there is api config in legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(saveVcssStorageProviderStub.called).toBeTruthy();
                expect(saveVcssStorageProviderStub.firstCall.args).toEqual([[serializedVcs]]);
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must not save vcss if there is no api config in legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(emptyApiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(saveVcssStorageProviderStub.called).toBeFalsy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must not save vcss if any error occurs when retrieving api config from legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .rejects(expectedError);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
                expect(saveVcssStorageProviderStub.called).toBeFalsy();
            })
            .finally(done);
    });

    it('must not save vcss if any error occurs when retrieving vcss from storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .rejects(expectedError);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
                expect(saveVcssStorageProviderStub.called).toBeFalsy();
            })
            .finally(done);
    });

    it('must clear legacy if no error occurs and there is api config in legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(clearLegacyStorageProviderStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must clear legacy if no error occurs and there is no api config in legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(emptyApiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                expect(clearLegacyStorageProviderStub.called).toBeTruthy();
            })
            .catch(function (error) {
                expect(error).toBeUndefined();
            })
            .finally(done);
    });

    it('must not clear legacy if any error occurs when retrieving api config from legacy storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .rejects(expectedError);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
                expect(clearLegacyStorageProviderStub.called).toBeFalsy();
            })
            .finally(done);
    });

    it('must not clear legacy if any error occurs when retrieving vcss from storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .rejects(expectedError);
        saveVcssStorageProviderStub
            .resolves();
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
                expect(clearLegacyStorageProviderStub.called).toBeFalsy();
            })
            .finally(done);
    });

    it('must not clear legacy if any error occurs when saving vcss to storage', function (done) {
        // Arrange
        getApiConfigLegacyStorageProviderStub
            .resolves(apiConfig);
        getVcssStorageProviderStub
            .resolves(emptyVcss);
        saveVcssStorageProviderStub
            .rejects(expectedError);
        clearLegacyStorageProviderStub
            .resolves();

        // Act
        var promise = updateLegacyStorage.update(storageProviderStub, legacyStorageProviderStub);

        // Assert
        promise
            .then(function () {
                fail('An error was expected');
            })
            .catch(function (error) {
                expect(error).toEqual(expectedError);
                expect(clearLegacyStorageProviderStub.called).toBeFalsy();
            })
            .finally(done);
    });
});
