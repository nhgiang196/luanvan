/**
 * Created by wangyanyan on 2016-08-25.
 */
define(['myapp', 'angular'], function(myapp, angular) {
    myapp.controller("TestController", ['$scope', 'EngineApi', '$http', '$timeout', 'Notifications', '$compile', '$filter', 'Auth', '$upload', '$resource', '$translatePartialLoader', '$translate',
        function ($scope, EngineApi, $http, $timeout, Notifications, $compile, $filter, Auth, $upload, $resource, $translatePartialLoader, $translate) {
            $scope.showreformpic=function(filename,mimetype){
                $scope.imageUrl='/api/cmis/downfile?filename='+filename+"&mimetype="+mimetype;
                $("#afterModal").modal('show');

            }
            $http.get('/api/cmis/testfiledb').success(function (data) {
                console.log(data);
                $scope.files=data;
            }).error(function (data, status) {
                Notifications.addError({'status': 'error', 'message':  status + data});
            });
            $scope.deletefile=function(docid,index){
              var  data="DocId="+docid;
                $http.delete('/api/cmis/deletefile?' + data)
                    .success(function (data, status, headers) {
                        console.log(data);
                        $scope.files.splice(index, 1);
                    })
                    .error(function (data, status, header, config) {
                        Notifications.addError({'status': 'error', 'message':  status + data});
                    });
            }
            $scope.onFileSelect = function($files,size) {
                console.log($files);
                if(!size){
                    size=1024*1024*1;
                }
                if($files.size>size){
                    Notifications.addError({'status': 'error', 'message':"upload file can't over "+size+"byte" });
                    return false;
                }else {
                    for (var i = 0; i < $files.length; i++) {
                        var $file = $files[i];

                        $scope.upload = $upload.upload({
                            url: '/api/cmis/upload',
                            method: "POST",
                            file: $file
                        }).progress(function (evt) {
                            // get upload percentage
                            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));

                        }).success(function (data, status, headers, config) {
                            // file is uploaded successfully
                            console.log(data.file);
                            $scope.files.push(data.file);
                        }).error(function (data, status, headers, config) {
                            console.log($file);
                            console.log(status);
                            console.log(data);
                        });
                    }
                }
            }
        }])


})