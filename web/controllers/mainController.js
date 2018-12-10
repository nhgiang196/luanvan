
define(['myapp', 'angular', 'bpmn'], function (myapp, angular, Bpmn) {
    myapp.controller("mainController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'EngineApi', 'Notifications', '$rootScope', 'Auth', 'User', '$translate',
        function ($scope, $http, $compile, $routeParams, $resource, $location, Forms, EngineApi, Notifications, $rootScope, Auth, User, $translate) {
            console.log(Auth.username);
            /*  $translatePartialLoader.addPart('Basic');
                $translate.refresh();*/
            //Lấy thông thông tin proxy
            // function getProxyUser() {
            //     EngineApi.getMyProxyUser().myget({
            //         'userid': User
            //     }).$promise.then(function (leavers) {

            //         if (leavers.length > 0) {
            //             $scope.isProxyUser = true;
            //         } else {
            //             $scope.isProxyUser = false;
            //         }
            //     }, function (error) {
            //         Notifications.addError({
            //             'status': 'error',
            //             'message': error
            //         });
            //     });
            // }
            angular.element(document).ready(function () {
                var taskcounter;
                var queryObject = {};
                console.log(User);
                // getProxyUser();
                if (User) {

                    // EngineApi.getProxyUser().get({
                    //     'userid': User
                    // }).$promise.then(function (leavers) {
                    //     console.log(leavers);
                    //     if (leavers.length > 0) {
                    //         var leaver = leavers[0].UserId;
                    //         EngineApi.getTaskCount().get({
                    //             'assignee': leaver
                    //         }).$promise.then(function (le_taskcounter) {
                    //             console.log(le_taskcounter.count);
                    //             EngineApi.getTaskCount().get({
                    //                 'candidateUser': leaver
                    //             }).$promise.then(function (le_candidateTasksCounter) {
                    //                 console.log(le_candidateTasksCounter.count);
                    //                 // $scope.tasksCounter = taskcounter.count + candidateTasksCounter.count;
                    //                 EngineApi.getTaskCount().get({
                    //                     'assignee': User
                    //                 }).$promise.then(function (taskcounter) {
                    //                     console.log(taskcounter.count);
                    //                     EngineApi.getTaskCount().get({
                    //                         'candidateUser': User
                    //                     }).$promise.then(function (candidateTasksCounter) {
                    //                         console.log(candidateTasksCounter.count);
                    //                         $scope.tasksCounter = taskcounter.count + candidateTasksCounter.count + le_taskcounter.count + le_candidateTasksCounter.count;
                    //                     });
                    //                 });
                    //             });
                    //         });
                    //     } else {
                    //         EngineApi.getTaskCount().get({
                    //             'assignee': User
                    //         }).$promise.then(function (taskcounter) {
                    //             EngineApi.getTaskCount().get({
                    //                 'candidateUser': User
                    //             }).$promise.then(function (candidateTasksCounter) {
                    //                 $scope.tasksCounter = taskcounter.count + candidateTasksCounter.count;
                    //             });
                    //         });
                    //     }
                    // });



                }

                $scope.btSelectAuth = function (key, flowkey) {
                    EngineApi.getTcodeLink().get({
                        "userid": User,
                        "tcode": key
                    }, function (linkres) {
                        //  console.log(linkres);
                        if (linkres.IsSuccess) {
                            EngineApi.getKeyId().getkey({
                                "key": flowkey
                            }, function (res) {
                                console.log(res);
                                console.log(res.id);
                                ///taskForm/start/:id
                                $location.url("/taskForm/start/" + res.id);
                            });
                        } else {
                            Notifications.addError({
                                'status': 'error',
                                'message': "You do not have permission！"
                            });
                        }
                    })
                }
                $scope.btSelect = function (key) {
                    console.log(key);
                    console.log(User);
                    ///api/HSSE/CheckTCode/:userid/:tcode
                    EngineApi.getTcodeLink().get({
                        "userid": User,
                        "tcode": key
                    }, function (linkres) {
                        //  console.log(linkres);
                        if (linkres.IsSuccess) {
                            EngineApi.getKeyId().getkey({
                                "key": key
                            }, function (res) {
                                console.log(res);
                                console.log(res.id);
                                ///taskForm/start/:id
                                $location.url("/taskForm/start/" + res.id);
                            });
                        } else {
                            Notifications.addError({
                                'status': 'error',
                                'message': "You do not have permission！"
                            });
                        }
                    })
                }
                $scope.btCheckAuth = function (key, url) {
                    console.log('maincontroller\btCheckAuth:' + User);
                    console.log('maincontroller\btCheckAuth:' + key);
                    console.log('maincontroller\btCheckAuth:' + url);
                    EngineApi.getTcodeLink().get({
                        "userid": User,
                        "tcode": key
                    }, function (linkres) {
                        if (linkres.IsSuccess) {
                            $location.url(url);
                        } else {
                            Notifications.addError({
                                'status': 'error',
                                'message': "You do not have permission！"
                            });
                        }
                    });

                }

            })
        }
    ]);
    myapp.controller("UserInfoController", ['Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService',
        function (Auth, $scope, ttp, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService) {
            // var isAdmin = Auth.nickname.indexOf('Administrator') != -1;
            // $scope.isAdmin = isAdmin;
            $scope.isGV = true;
            $scope.info = {};
            var q = { st: '' };
            if (Auth.username.indexOf('MS') >= 0) {
                $scope.isGV = false;
                q.st = "select * from HocVien h LEFT JOIN HocCN hc ON h.hv=hc.hv \
                LEFT JOIN ChuyenNganh cn ON cn.cn=hc.cn\
                LEFT JOIN DeTaiLV dt ON dt.hv = dt.hv and cn.cn=dt.cn\
            	LEFT JOIN HDLV hd ON hd.lv = dt.lv\
				LEFT JOIN HuongDan a ON a.lv= dt.lv\
				JOIn GiangVien gv ON gv.gv = a.gv\
                where h.hv='" + Auth.username +  "'";
            }
            else q.st = "select * from GiangVien g LEFT JOIN CMGV \
             c ON g.gv=c.gv LEFT JOIN LinhVucChuyenMon l ON l.cm=c.cm \
             where g.gv='" + Auth.username + "'";
            THSAdminService.ADC(q, function (data) {
                console.log(data);
                $scope.info = data[0];
                $scope.detail = data;
            });
                    
            $scope.sumbit = function () {
                if ($scope.oldP && $scope.newPassword && User) {
                    var UpdatePassword = $resource("/ths/THSAdminController/ChangePassword", {}, {
                        update: {
                            method: 'POST'
                        }
                    });
                    UpdatePassword.update({
                        "username": User,
                        "pass": $scope.oldP,
                        "newpass": $scope.newPassword
                    }).$promise.then(function (data) {
                        console.log(data.message);
                        if (data.Data != null && data.Data != '')
                            alert("Password reset complete");
                        else
                            alert("You enter the wrong password");
                    }, function (errResponse) {
                        console.log(errResponse);
                        Notifications.addError({
                            'status': 'error',
                            'message': errResponse.data.Message
                        });
                    });

                }
            }
        }]);




});