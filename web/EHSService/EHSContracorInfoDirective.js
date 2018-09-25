/**
 * Created by wangyanyan on 2017/2/18.
 */
define(['app', 'angular'], function (app, angular) {
    app.directive('myContractor', ['$resource', '$http', '$filter', 'Notifications', 'ConQuaService', '$routeParams', function ($resource, $http, $filter, Notifications, ConQuaService, $routeParams) {
        return {

            restrict: 'E',
            transclude: true,
            scope: false,
            controller: function ($scope) {
                console.log("myContractor");
                var lang = window.localStorage.lang;
                ConQuaService.ContractorTypeList().get({kind: "Kind", language: lang}).$promise.then(function (res) {
                    $scope.KindList = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                ConQuaService.ContractorTypeList().get({kind: "Type", language: lang}).$promise.then(function (res) {
                    $scope.CTypeList = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });


                $scope.upAddition = function (type) {
                    if ($scope.projects.Employer) {
                        $scope.upType = type;
                        $('#cerModal').modal('show');
                    } else {
                        Notifications.addError({'status': 'error', 'message': "Name is Null"});
                    }
                }
                $scope.addCer = function () {

                    var type = $scope.upType;
                    var model = [];
                    if (type == "BusinessLicence") {
                        model = $scope.BusinessLicence || [];
                    }
                    else if (type == "Cer2") {
                        model = $scope.Cer2 || [];
                    }
                    else if (type == "Cer3") {
                        model = $scope.Cer3 || [];
                    }
                    else if (type == "Cer4") {
                        model = $scope.Cer4 || [];
                    } else {
                        Notifications.addError({'status': 'error', 'message': "Type is error"});
                        return;
                    }
                    if ($scope.note.InvalidTime <= $filter('date')(new Date(), "yyyy-MM-dd")) {
                        Notifications.addError({'status': 'error', 'message': "有效期要大于当天：" + $scope.note.InvalidTime});
                        return
                    }
                    for (var i = 0, cer; !!(cer = model[i]); i++) {
                        if (cer.Code == $scope.note.Code && cer.FileType == type) {
                            console.log("重复");
                            Notifications.addError({'status': 'error', 'message': $translate.instant('Msg_ConQua_Duplicate') + $scope.note.Code});
                            return;
                        }
                    }
                    var file = $scope.note;
                    file.EmployerId = $scope.projects.EmployerId;
                    file.FileType = type;
                    file.Files = $scope.filedata;// JSON.stringify($scope.filedata);
                    model.push(file);
                    $scope.filedata = [];
                    $scope.note = {};
                    $('#cerModal').modal('hide');
                    console.log($scope.BusinessLicence);
                    console.log($scope.Cer2);
                    console.log($scope.Cer3);
                    console.log($scope.Cer4);
                }
                function isCanRemove(id, filetype, callback) {
                    ConQuaService.ContractorQualification().getFile({
                        employerId: $scope.projects.EmployerId,
                        code: code,
                        filetype: filetype
                    }).$promise.then(function (data) {
                        callback(data, "")

                    }, function (errResponse) {
                        console.log(errResponse);
                        callback(0, errResponse);

                    });


                }

                $scope.cerDel = function (mode, index, code, filetype) {
                    console.log(mode[index].Code);
                    if (!mode[index].ID) {
                        $.each(mode[index].Files, function (i, file) {
                            var data = "DocId=" + file.DocId;
                            $http.delete('/api/cmis/deletefile?' + data)
                                .success(function (data, status, headers) {
                                    console.log("删除文件成功：" + file.OldName);
                                    mode.splice(index, 1);
                                })
                                .error(function (data, status, header, config) {
                                    Notifications.addError({'status': 'error', 'message': status + data});
                                });

                        });
                    } else {
                        mode.splice(index, 1);
                    }
                };

            },
            templateUrl: './forms/ConQua/new.html'
        }
    }]);
});