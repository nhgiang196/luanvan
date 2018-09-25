define(['app'], function (app) {

    app.directive('myDelfile', ['$resource', '$document', '$upload', 'Notifications', 'EngineApi','$http', function ($resource, $document, $upload, Notifications, EngineApi,$http) {
        return {
            restrict: 'E',
            transclude: true,
            scope: false,
            controller: function ($scope, $document, $upload) {
                function uploadFiles($files, callback) {
                    var filedata = [];
                    //only 单个上传
                        var $file = $files[0];
                        console.log($file);
                        $scope.upload = $upload.upload({
                            url:  '/api/cmis/upload',
                            method: "POST",
                            file: $file
                        }).progress(function (evt) {
                                // get upload percentage
                                var percentInt = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('percent: ' + percentInt);
                                $("#MyFileUploadProcessBar").css("width", percentInt.toString() + "%");
                                $("#MyFileUploadProcessBarText").html("uploaded" + percentInt + "%");
                                if (percentInt = 0) {
                                    $("#MyFileUploadProcessBarDiv").show();
                                } else if (percentInt = 100) {
                                    setTimeout(function () {
                                        $("#MyFileUploadProcessBar").css("width", "0%");
                                    }, 2000);
                                }
                            }).success(function (data, status, headers, config) {
                                // file is uploaded successfully
                                console.log("file is uploaded successfully");
                            console.log(data.file);
                                filedata.push({ DocId: data.file.DocId, Name: data.file.Name, OldName: data.file.OldName,FileType:data.file.FileType, FolderName: data.file.FolderName});
                                callback(filedata);
                                return;
                            }).error(function (data, status, headers, config) {
                                   Notifications.addError({'status': 'error', 'message':  status + data});

                                console.log(status);
                                console.log(data);
                            });
                    }


                $scope.onFileSelect = function ($files,size) {

                    console.log($files);
                    //检查上传文件  文件大小限制为5M
                    if(true){
                        var $checkfile = $files[0];
                        console.log("=========================");
                        console.log("onFileSelect-----FileSize"+$checkfile.size);
                        console.log("=========================");
                         if(!size){
                             size=1024*1024*1;
                         }
                        if($checkfile.size>size){
                           // Notifications.addError({'status': 'error', 'message':"upload file can't over "+size+"byte" });
                            alert( "upload file can't over "+size+"byte");
                            return false;
                        }
                    }
                    uploadFiles($files, function (filedate) {
                        for (var i = 0; i < filedate.length; i++) {
                            $scope.filedata.push(filedate[i]);
                            console.log($scope.filedata[i]);
                        }

                    });
                }



                $scope.removeFile = function (index) {
                    var file = $scope.filedata[index];
                    console.log("删除文件Index=" + index + ",FileName=" + file.OldName);
                    var  data="DocId="+file.DocId;
                    $http.delete('/api/cmis/deletefile?' + data)
                        .success(function (data, status, headers) {
                            console.log(data);
                            $scope.filedata.splice(index, 1);
                        })
                        .error(function (data, status, header, config) {
                            Notifications.addError({'status': 'error', 'message':  status + data});
                        });

                }
                //格式化显示文件名
                $scope.formatFileName = function (_fileName) {
                    if (_fileName.length > 20) {
                        return _fileName.substring(0, 9) + "..." + _fileName.substring(_fileName.length - 9);
                    } else {
                        return _fileName;
                    }
                }
            },


            templateUrl: '../TemplateViews/MyUploadTemplate.html'
        }
    }]);


});