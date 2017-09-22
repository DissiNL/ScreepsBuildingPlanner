APP.directive('cell', function () {
    return {
        scope: {
            'cell': '=cell'
        },
        controller: function ($scope, $element, $attrs) {
            $element.tooltip({
                title: function () {
                    return $scope.cell.x + ', ' + $scope.cell.y;
                }
            });
        }
    };
});