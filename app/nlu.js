angular.module('nlu', [])
    .controller('MainController', ($http, $scope) => {

        $scope.sampleText = "";
        $scope.loading = false;
        $scope.data;
        $scope.getData = function () {
            if ($scope.sampleText.split(" ").length < 20) {
                swal(
                    'Input Not Long enough',
                    'Your string should have at least 20 words',
                    'error'
                );
                return;
            }
            $scope.data = undefined;
            $scope.loading = true;

            $http.post(nlu + "extract-entity", { text: $scope.sampleText })
                .then((res) => {
                    $scope.data = res.data[0];
                    $scope.loading = false;
                },()=>{
                    $scope.loading = false;
                    swal(
                        'Something went wrong',
                        '',
                        'error'
                    );
                    return;
                });
        }


        $scope.getCategory = function (obj) {
            if (obj.category == "ORGANIZATION") {
                return obj.category;
            } else if (obj.nounCombinationCategory && obj.nounCombinationCategory.toUpperCase() !== "NONE") {
                return obj.nounCombinationCategory;
            } else {
                return obj.category;
            }
        }
    })