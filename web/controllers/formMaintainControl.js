/**
 * Created by wangyanyan on 14-3-13.
 */
define( ['myapp','angular'],function(myapp,angular){
    myapp.controller("formMaintainController",['$scope','$http','$compile','$routeParams','$resource','$location','Notifications','EngineApi','User',
        function($scope,$http,$compile,$routeParams,$resource,$location,Notifications,EngineApi,User){


            $scope.btGetUser=function(){
                $http.get('/ehs/RefreshUser').success(function (data) {
                        console.log(data);
                });
            }
            $scope.btCheckAuth = function (key, url) {

                EngineApi.getTcodeLink().get({"userid": User, "tcode": key}, function (linkres) {
                    if (linkres.IsSuccess) {
                        $location.url(url);
                    }else{
                        Notifications.addError({'status': 'error', 'message':"You do not have permission！" });
                    }
                });

            }

    }]);

});