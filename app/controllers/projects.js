var _ = require('underscore');

module.exports = function(log, api, dashboard, $scope, $interval, $timeout) {
    $scope.api = api;
    $scope.dashboard = dashboard;

    var isReady = function () {
        return $scope.dashboard.isReady() && $scope.api.isReady();
    };

    var updateProjects = function () {
        $scope.api.loadProjects()
            .then(function () {
                _.each($scope.api.projects, function (project) {
                    if (project.mustLoadPipeline) {
                        updateProjectPipeline(project);
                    }
                    if (project.mustLoadMergeRequests) {
                        updateProjectMergeRequests(project);
                    }
                });
                $timeout(updateProjects, $scope.dashboard.getRefreshRateMs());
                log.debug('[Controller - Projects]', 'Scheduling next project update');
            })
            .catch(function (error) {
                log.error('[Controller - Projects]', 'Error occurred while updating projects', error);
                $timeout(updateProjects, $scope.dashboard.getRefreshRateMs());
                log.debug('[Controller - Projects]', 'Scheduling next project update');
            });
    };

    var updateProjectPipeline = function (project) {
        $scope.api.loadPipeline(project)
            .then(function (pipeline) {
                project.pipeline(pipeline);
                log.debug('[Controller - Projects]', 'Project pipeline updated');
            })
            .catch(function (error) {
                log.error('[Controller - Projects]', 'Error occurred while updating project pipeline', error);
            });
    };

    var updateProjectMergeRequests = function (project) {
         $scope.api.loadMergeRequests(project)
            .then(function (mergeRequests) {
                project.mergeRequests(mergeRequests);
                log.debug('[Controller - Projects]', 'Project merge requests updated');
            })
            .catch(function (error) {
                log.error('[Controller - Projects]', 'Error occurred while updating project merge requests', error);
            });
     };

    var handler = $interval(function () {
        if (isReady()) {
            $interval.cancel(handler);
            log.debug('[Controller - Projects]', 'Controller is ready');
            updateProjects();
        }
    }, 1000);
};
