module.exports = function (log, storage) {
    var _this = this;

    this.refreshRateSec = undefined;

    this.isReady = function () {
        return _this.refreshRateSec !== undefined;
    };

    this.getRefreshRateMs = function () {
        return _this.refreshRateSec * 1000;
    };

    this.save = function () {
        storage.saveDashboardConfig(_this.refreshRateSec)
            .then(function (config) {
                log.debug('[Service - Dashboard]', 'Configurations successfully saved');
            })
            .catch(function (error) {
                log.error('[Service - Dashboard]', 'Error occurred while saving configurations', error);
            });
    };

    var load = function () {
        storage.getDashboardConfig()
            .then(function (config) {
                _this.refreshRateSec = config.refreshRateSec;
                log.debug('[Service - Dashboard]', 'Configurations successfully retrieved');
            })
            .catch(function (error) {
                log.error('[Service - Dashboard]', 'Error occurred while retrieving configurations', error);
            });
    };

    load();
};
