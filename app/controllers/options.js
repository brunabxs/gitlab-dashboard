module.exports = function(log, api, dashboard, $scope, $interval, $timeout) {
    $scope.api = api;
    $scope.dashboard = dashboard;

    var isReady = function () {
        return $scope.dashboard.isReady() && $scope.api.isReady();
    };

    $scope.canSave = function () {
        return isReady();
    };

    $scope.save = function () {
        if ($scope.canSave()) {
            log.debug('[Controller - Options]', 'Controller is allowed to save');
            $scope.api.save();
            $scope.dashboard.save();
        }
    };
};
