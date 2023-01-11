var sample = angular.module("sample", []);
sample.controller("myctrl", function ($scope, $http) {
    $http.get('sample.json')
        .success(function (response) {
            $scope.entry = response.data;
        });
});

sample.filter("toUpperCase", function () {
    return function (input) {
        var output = "";
        output = input.toUpperCase();
        return output;
    }
});

sample.filter("americanConvertion", function () {
    return function (input) {
        var rupee;
        rupee = input / 75;
        return rupee;
    }
});

sample.filter('salaryGreaterThan', function () {

    return function (input, Salary) {
        var output = [];
        if (isNaN(Salary)) {

            output = input;
        }
        else {
            angular.forEach(input, function (item) {

                if (item.Salary > Salary) {
                    output.push(item)
                }
            });
        }
        return output;
    }
})