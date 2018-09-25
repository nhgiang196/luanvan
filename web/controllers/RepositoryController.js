/**
 * Created by wangyanyan on 2016-08-02.
 */
define( ['myapp','angular','bpmn'],function(myapp,angular,Bpmn) {
    myapp.controller("RepositoryController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'EngineApi', 'User','Notifications','$upload',
        function ($scope, $http, $compile, $routeParams, $resource, $location, Forms, EngineApi, User,Notifications,$upload) {

            function searchBpm(){
                if( $scope.key)
                {
                    var queryObject = { key : $scope.key };

                }else{
                    var queryObject = {};
                }
                $scope.processDefinitions =  EngineApi.getProcessDefinitions().getList(queryObject);
            }
            $scope.search=function(){
                if( $scope.key)
                {
                    var queryObject = { key : $scope.key };

                }else{
                    var queryObject = {};
                }
                $scope.processDefinitions =  EngineApi.getProcessDefinitions().getList(queryObject);
            }

            $scope.onFileSelect = function ($files) {
                console.log($files);
                if (true) {
                    var $checkfile = $files[0];
                    if ($checkfile.size > 1024 * 1024 * 1) {
                        Notifications.addError({'status': 'error', 'message': "上传文件大小不能超过3M" });
                        return false;
                    }
                }
                var $file = $files[0];
                $scope.upload = $upload.upload({
                    url: '/bpm/api/default/bpm-rest-api/deployment/create',
                    method: "POST",
                    file: $file
                }).progress(function (evt) {
                    // get upload percentage
                    var percentInt = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('percent: ' + percentInt);
                    $("#MyFileUploadProcessBar").css("width", percentInt.toString() + "%");
                    $("#MyFileUploadProcessBarText").html("已上传" + percentInt + "%");
                    if (percentInt = 0) {
                        $("#MyFileUploadProcessBarDiv").show();
                    } else if (percentInt = 100) {
                        setTimeout(function () {
                            $("#MyFileUploadProcessBar").css("width", "0%");
                        }, 2000);
                    }
                }).success(function (data, status, headers, config) {
                    $scope.key=data.name;
                    searchBpm();
                    Notifications.addMessage({'status': 'information', 'message': "file is uploaded successfully"});

                }).error(function (data, status, headers, config) {

                    Notifications.addError({'status': 'error', 'message': status+data});
                });

            }

        }])
});