app.directive('onFileSelected', [function() {
     return {
         restrict: 'A',
         scope: false,
        //  {
        //      onFileSelected: '&'
        //  },
         link: function($scope, element, attr, ctrl) {
             element.bind("change", function() {
                 $scope.onFileChange(element[0].files[0]);
             });
         }
     }
 }]);
