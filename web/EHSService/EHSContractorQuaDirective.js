/**
 * Created by wang.chen on 2017/2/21.
 */
define(['app', 'angular'], function (app, angular) {
    app.directive('mycontractorqua', ['$resource', '$http', '$filter', 'Notifications', 'ConQuaService', '$routeParams', '$translate',function ($resource, $http, $filter, Notifications, ConQuaService, $routeParams,$translate) {
        return {

            restrict: 'E',
            transclude: true,
            scope: false,
            controller: function ($scope) {
                console.log("myContractorQua")
                $scope.flowkey="GateContractorQuaProcess";
                $scope.cers = [];
                $scope.inss = [];
                var query = {};
                $scope.event = {};
                query.Language = window.localStorage.lang;
                query.employer = $scope.event.Employer || "";
                query.cType = "";
                query.departmentID = "";
                ConQuaService.GetContractorQualification().get(query).$promise.then(function (res) {
                    $scope.employers = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                ConQuaService.GetCerTypes().get({Language: window.localStorage.lang}).$promise.then(function (res) {
                    $scope.cerTypes = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                ConQuaService.GetIssuedBy().get({Language: window.localStorage.lang}).$promise.then(function (res) {
                    $scope.issuedBys = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                ConQuaService.GetInsTypes().get({Language: window.localStorage.lang}).$promise.then(function (res) {
                    $scope.insTypes = res;
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                ConQuaService.GetEquipmentList().get({Language: window.localStorage.lang}).$promise.then(function (res) {
                    $scope.equips = res;
                    $scope.checkboxes = new Array($scope.equips.length);
                }, function (errResponse) {
                    Notifications.addError({'status': 'error', 'message': errResponse});
                });
                //证书
                $scope.cerDel = function (index) {
                    if(confirm( $translate.instant('Delete_IS_MSG '))) {
                        if ($scope.cers[index].CerId) {
                            isCanCerRemove($scope.cers[index].CerId, function (count) {
                                $scope.cers.splice(index, 1);
                                if (count <= 0) {
                                    $.each($scope.cers[index].Files, function (i, file) {
                                        $http.delete("/api/cmis/deletefile?" + "DocId=" + file.DocId).success(function () {
                                            console.log("删除文件成功：" + file.OldName);
                                        }).error(function (checkData, status) {
                                            Notifications.addError({
                                                'status': 'error',
                                                'message': $transition.instant("ConQua_DeleteFileFailed") + status + checkData
                                            });
                                        });
                                    });
                                    $scope.cers.splice(index, 1);
                                } else {
                                    $scope.cers.splice(index, 1);
                                }
                            });
                        }
                    }
                }
                function isCanCerRemove(cerId, callback) {
                    ConQuaService.GetCer().get({
                        cerId: cerId,
                        idCard: $scope.event.IdCard ,
                        employerId: $scope.event.Employer || ""
                    }).$promise.then(function (res) {
                            callback(res.Files.length)
                        }, function (err) {
                            Notifications.addError({'status': 'error', 'message': err})
                        });
                }
                $scope.addCer = function () {
                    for (var i = 0, cer; !!(cer = $scope.cers[i]); i++) {
                        if (cer.CerId == $scope.cerId) {
                            console.log("重复");
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant("Msg_ConQua_Duplicate") + $scope.cerId
                            });
                            return;
                        }
                    }
                    console.log("addCer");
                    var cer = {};
                    cer.CerId = $scope.cerId;
                    cer.CerName = $scope.cerName;
                    cer.IssuedBy = $scope.issuedBy;
                    cer.ValidTo = $scope.cerValidTo;
                    cer.JsonFile = JSON.stringify($scope.filedata);
                    cer.Files = $scope.filedata;
                    for (var i = 0; i < $scope.cerTypes.length; i++) {
                        if ($scope.cerTypes[i].ID == $scope.cerName) {
                            cer.CerNameRemark = $scope.cerTypes[i].CerType;
                            break
                        }
                    }
                    cer.IssuedByRemark = $filter('filter')($scope.issuedBys, $scope.IssuedBy)[0].IssuedBy || "";
                    $scope.cers.push(cer);
                    $scope.cerId = null;
                    $scope.cerName = null;
                    $scope.issuedBy = null;
                    $scope.cerValidTo = null;
                    $scope.filedata = [];
                    $('#cerModal').modal('hide');
                };
                //保险
                $scope.insDel = function (index) {
                    if(confirm( $translate.instant('Delete_IS_MSG '))) {
                        //这个保险是否在其他的承揽商已经使用
                        if ($scope.inss[index].InsId) {
                            isCanRemove($scope.inss[index].InsId, function (count) {
                                $scope.inss.splice(index, 1);
                                if (count <= 0) {
                                    $.each($scope.inss[index].Files, function (i, file) {
                                        var data = "DocId=" + file.DocId;
                                        $http.delete('/api/cmis/deletefile?' + data)
                                            .success(function () {
                                                console.log("删除文件成功：" + file.OldName);
                                            }).error(function (checkData, status) {
                                                console.error("删除文件失败!");
                                                Notifications.addError({
                                                    'status': 'error',
                                                    'message': "删除文件信息失败：" + status + checkData
                                                });
                                            });
                                    });
                                    $scope.inss.splice(index, 1);
                                } else {
                                    $scope.inss.splice(index, 1);
                                }
                            })
                        }

                    }
                };
                function isCanRemove(InsId, callback) {
                    ConQuaService.GetIns().get({
                        insId: InsId,
                        employerId: $scope.event.Employer
                    }).$promise.then(function (res) {
                            callback(res)
                        }, function (err) {
                            Notifications.addError({'status': 'error', 'message': err})
                        });
                }
                $scope.addIns = function () {
                    for (var i = 0, ins; !!(ins = $scope.inss[i]); i++) {
                        if (ins.InsId == $scope.insId) {
                            console.log("重复");
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant("Msg_ConQua_Duplicate") + $scope.insId
                            });
                            return;
                        }
                    }
                    var ins = {};
                    ins.InsId = $scope.insId;
                    ins.InsName = $scope.insName;
                    ins.ValidTo = $scope.insValidTo;
                    ins.JsonFile = JSON.stringify($scope.filedata);
                    ins.Files = $scope.filedata;
                    ins.InsNameRemark = $filter('filter')($scope.insTypes, $scope.insName)[0].InsType || "";
                    $scope.inss.push(ins);
                    $scope.insId = null;
                    $scope.insName = null;
                    $scope.insValidTo = null;
                    $scope.filedata = [];
                    $('#insModal').modal('hide');
                };
                //文件
                $scope.trainFile = [];
                $scope.healthFile = [];
                $scope.upAddition = function (type) {
                    $scope.upType = type;
                    switch (type) {
                        case "train":
                            $scope.filedata = $scope.trainFile || [];
                            break;
                        case "health":
                            $scope.filedata = $scope.healthFile || [];
                            break;
                    }
                    $('#fileModal').modal("show");
                };
                $scope.saveFile = function () {
                    if ($scope.filedata.length > 1) {
                        Notifications.addError({'status': 'error', 'message': $translate.instant("Msg_ConQua_FileNumber")})
                        return
                    }
                    switch ($scope.upType) {
                        case "train":
                            $scope.trainFile = $scope.filedata;
                            $scope.filedata = [];
                            break;
                        case "health":
                            $scope.healthFile = $scope.filedata;
                            $scope.filedata = [];
                            break;
                    }
                    $('#fileModal').modal("hide");
                };
                //护具
                $scope.note = {}
                $scope.addEquip = function () {
                    $scope.note.equipment = "";
                    console.log($scope.checkboxes)
                    for (var i = 0; i < $scope.checkboxes.length; i++) {
                        if ($scope.checkboxes[i] != null && $scope.checkboxes[i] != "false") {
                            for (var j = 0; j < $scope.equips.length; j++) {
                                var eq = $scope.equips[j]
                                if (eq.ID == $scope.checkboxes[i]) {
                                    if ($scope.note.equipment == "") {
                                        $scope.note.equipment = eq.Equipment;
                                    }
                                    else {
                                        $scope.note.equipment = $scope.note.equipment + "/" + eq.Equipment;
                                    }
                                }
                            }
                        }
                    }
                    $('#equipModal').modal('hide');
                };


            },
            templateUrl: './forms/ContractorQua/new.html'
        }
    }]);
});