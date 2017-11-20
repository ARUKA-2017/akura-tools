angular.module('nlu', [])
    .controller('MainController', ($http, $scope, $rootScope) => {

        var socket;
        var uuid;
        socket = io(sock);
        $rootScope.lines = "";
        socket.on("VALUE", function (obj) {
            console.log("socekt", obj);

            $rootScope.lines += obj;
            $("#log").append("<br>" + obj.replace(/\s/g, "&nbsp;&nbsp;"));
        });

        $scope.sampleText = "";
        $scope.mainEntity = "";
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

            uuid = Math.random();

            $rootScope.lines = "";
            $("#log").html("");
            $http.post(nlu + "extract-entity", { text: $scope.sampleText, entity: $scope.mainEntity })
                .then((res) => {
                    $scope.data = res.data[0];
                    $scope.loading = false;
                }, () => {
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