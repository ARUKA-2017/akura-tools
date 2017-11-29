angular.module('nlu', ['hljs'])
.config(function (hljsServiceProvider) {
    hljsServiceProvider.setOptions({tabReplace: '  '})
  })
    .controller('MainController', ($http, $scope, $rootScope) => {

        var socket;
        var uuid;
        socket = io(sock);
        $rootScope.lines = "";
        $scope.details = [];
        socket.on("VALUE", function (obj) {
            // console.log("socekt", obj);
            var tmp;
            // check title
            if(checkType(obj,'#TITLE-')){
                tmp = checkType(obj,'#TITLE-');
            } // check subtitle
            else if(checkType(obj,'#SUB-')){
                tmp = checkType(obj,'#SUB-');

            } // check desc
            else if(checkType(obj,'#CONT-')){
                tmp = checkType(obj,'#CONT-');
                
            } // check json
            else if(checkType(obj,'#JSON-')){
                tmp = checkType(obj,'#JSON-');
                
            }
            // $rootScope.lines += obj;
            $scope.details = $scope.details.concat(tmp);
            $scope.$apply();
            // $("#log").append("<br>" + obj.replace(/\s/g, "&nbsp;&nbsp;"));
        });


        function checkType(str,type){

             var tmp = str.split(type);
             if(tmp.length > 1){
                 if(type == '#JSON-'){
                    tmp[1] = JSON.stringify(getJSON(tmp[1]),null,'\t');
                    console.log(tmp[1]);
                 }
                 return {
                     arr: tmp,
                     type:type
                 };
             }else{
                 return false;
             }

        }

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
            $scope.details = [];
   
            $http.post(nlu + "extract-entity", { text: $scope.sampleText})
                .then((res) => {
                    console.log(res.data);
                    $scope.data = res.data.data[0];
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
        };


        $scope.getCategory = function (obj) {
            if (obj.category == "ORGANIZATION") {
                return obj.category;
            } else if (obj.nounCombinationCategory && obj.nounCombinationCategory.toUpperCase() !== "NONE") {
                return obj.nounCombinationCategory;
            } else {
                return obj.category;
            }
        }



       function getJSON(str){
            var jsn = '';
            try{
                var tmp = JSON.parse(str);
                jsn = tmp;
                
            }catch(e){
                console.log("came to catch");
                jsn = str;
            }
            console.log("JSON", jsn);
            return jsn;
        }
    })