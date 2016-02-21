angular
    .module('app')
    .controller('eventModalController', ['authenticationService', '$rootScope', '$scope', '$uibModal', '$log', '$route', '$location',
    function(authenticationService, $rootScope, $scope, $uibModal, $log, $route, $location) {

        $scope.animationsEnabled = true;

        $rootScope.openEventModal = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/eventModal.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular
    .module('app')
    .controller('ModalInstanceCtrl', ['authenticationService', 'pageRedirectService', 'adminPanelService', '$scope', '$uibModalInstance', '$rootScope',
    function(authenticationService, pageRedirectService, adminPanelService, $scope, $uibModalInstance, $rootScope) {
        $scope.emc = {};
        requestParameters = {};

        $scope.submit = function(event) {
            requestParameters.user = event;
            requestParameters.actionToPerform = 'addHackathon';
            adminPanelService.getInfo(requestParameters).success (function(response) {
                $scope.cancel();
                authenticationService.validateCredentials(function() {
                    pageRedirectService.redirect('admin', response.hackathon[0].ID);
                });
            });
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
