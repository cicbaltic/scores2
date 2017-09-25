angular
    .module('app')
    .controller('captchaModalController', ['authenticationService', '$rootScope', '$scope', '$uibModal',
    '$log', '$route', '$location',  
    function(authenticationService, $rootScope, $scope, $uibModal, $log, $route, $location) {

        $scope.animationsEnabled = true;

        $rootScope.openCaptchaModal = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'templates/captchaModal.html',
                controller: 'ModalCaptchaInstanceCtrl',
                size: size,
                backdrop  : 'static',
                keyboard  : false
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
    .controller('ModalCaptchaInstanceCtrl', ['authenticationService', 'pageRedirectService', 'adminPanelService', '$scope',
    '$uibModalInstance', '$rootScope', '$http', '$location',
    function(authenticationService, pageRedirectService, adminPanelService, $scope, $uibModalInstance, $rootScope,
        $http, $location) {
        $scope.cmc = {};
        requestParameters = {};
        var captcha;

        $scope.getCaptcha = function(){
            $http.get('/api/getcaptcha').success(function(result){
                captcha = result;
                $scope.image = captcha.image;
            });
        };

        $scope.getCaptcha();
        $scope.showErr = false;

        $scope.captchaSubmit = function(input){
            $scope.captchaInput = input;
            if(captcha.numeric.toString() === $scope.captchaInput){
                $uibModalInstance.dismiss('cancel');
            }else{
                $scope.showErr = true;
                $scope.getCaptcha();
            }
        };
        $scope.cancel = function() {
            pageRedirectService.redirect('home');
        };
        $scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
            // console.log('Remove modal popup');
            $uibModalInstance.dismiss('cancel');
          });

    }]);
