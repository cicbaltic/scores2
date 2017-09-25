(function() {
    app.controller('landingController', ['$scope', 'pageRedirectService',
    'hackathonInfo', '$rootScope', function($scope, pageRedirectService, hackathonInfo, $rootScope) {
        
        $scope.hasInfo = false;
        $scope.hasRendered = false;
        $scope.renderCallNo = 0;
        
        $scope.isLoaded = function(){
            if($scope.hasInfo === true && $scope.hasRendered === true){
                return true;
            }else{
                return false;
            }
        };

        $scope.rendered = function(){ //function called in renderCallBack directive ; after-render in html
            $scope.renderCallNo++;
            if($scope.renderCallNo > 1){
                $scope.hasRendered = true;
            }
        }
        
        hackathonInfo.getAllHackathons().success(function(result) {
            $scope.hackathons = result;
            $rootScope.defaultHackathonId = result[0].id;
            $scope.hasInfo = true;
        });

        $scope.redirect = function redirect(id) {
            pageRedirectService.redirect('home', id);
        };

        $scope.hackathonIsSetup = function(hackathon){
            if(hackathon.VOTINGAUDIENCE === null || hackathon.VOTINGTYPE === null){
                if($rootScope.globals){
                    if($rootScope.globals.roles){
                        if($rootScope.globals.roles[hackathon.id]){
                            if($rootScope.globals.roles[hackathon.id].ORGANIZER){
                                return true;
                            }
                        }
                        if($rootScope.globals.roles.null){
                            return true;
                        }
                    }
                }
                return false;
            }else{
                return true;
            }
        }

        $scope.showCreateEvent = function(){
            if($rootScope.globals){
                if($rootScope.globals.roles){
                    if($rootScope.globals.roles.null){
                        return true;
                    }
                }
            }
        }

        $scope.createEvent = function(){
            $rootScope.openEventModal();
        }
    }]);
})();
