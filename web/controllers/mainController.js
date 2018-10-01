
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

                    //代理人 的任务
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
                //判断权限但不启动工作流
                $scope.btCheckAuth = function (key, url) {
                    console.log('maincontroller:'+User);
                    console.log('maincontroller:'+key);
                    console.log('maincontroller:'+url);
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
    myapp.controller("UserInfoController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User',
        function ($scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User) {
        $scope.sumbit = function () {
            if ($scope.oldP && $scope.newPassword && User) {
                var UpdatePassword = $resource("/ehs/gate/Checker/UpdatePassword", {}, {
                    update: {
                        method: 'POST'
                    }
                });
                UpdatePassword.update({
                    "username": User,
                    "oldP": $scope.oldP,
                    "newPassword": $scope.newPassword
                }).$promise.then(function (data) {
                    console.log(data);
                    alert("Password reset complete");
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