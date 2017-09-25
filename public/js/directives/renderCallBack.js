
app.directive('afterRender', function() {
    return {
        link: function($scope, element, attrs) {
            // Trigger when number of children changes,
            // including by directives like ng-repeat
            var watch = $scope.$watch(function() {
                return element.children().length;
            }, function() {
                // Wait for templates to render
                $scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                    // var children = element.children();
                    // console.log(children);
                    // $scope.hasRendered = true;
                    $scope.rendered(); 
                });
            });
        },
    };
});