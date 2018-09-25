/**
 * Created by wangyanyan on 2015-08-03.
 */
define( ['myapp','angular','bpmn'],function(myapp,angular,Bpmn){
    myapp.controller("TaskManageController",['$scope','$http','$compile','$routeParams','$resource','$location','Forms','EngineApi','User','Notifications',
        function($scope,$http,$compile,$routeParams,$resource,$location,Forms,EngineApi,User,Notifications){

            $scope.StopPId=function(){

                /*  $http.put( "/bpm/api/default/bpm-rest-api/process-instance/"+$scope.pid+"/suspended", { "suspended" : true
               }).success(function (response) {
                console.log(response)
                }).error(function (data, status) {
                        Notifications.addError({'status': 'error', 'message': "暂停失败：" + status + data});
                });*/

            }
            $scope.QueryPIdTask=function(){
                if(User=="cassie"){
                    if($scope.pid){
                        if(confirm("确定查询这个流程进程吗？")) {
                            EngineApi.getTasks().query({"processInstanceId": $scope.pid,"sortBy": "created", "sortOrder": "desc"}).$promise.then(function (tasklist) {
                                $scope.usertasklist = tasklist;
                            });
                      
                        }
                    }
                    else{
                        Notifications.addError({'status': 'error', 'message': "PID is NULL"});
                    }
                }
            }
            $scope.username="";
            $scope.deletePid=function(){
                if(User=="cassie"){
                    if(confirm("确定结束这个流程吗？")) {
                        $http.delete("/bpm/api/default/bpm-rest-api/process-instance/" + $scope.pid + "", { }).success(function (response) {
                            //alert("流程进程结束成功");
                            Notifications.addError({'status': 'information', 'message': "删除流程成功"});
                        }).error(function (data, status) {
                            Notifications.addError({'status': 'error', 'message': "删除流程失败：" + status + data});
                        });
                    }
                }else{
                    Notifications.addError({'status': 'error', 'message': "没有权限"});
                }


            }
            $scope.search=function(){
                EngineApi.getTasks().get({
                    "id": $scope.taskid
                }, function(res) {
                    console.log(res);
                    $scope.task=res;
                    if (res.message) {
                        console.log(res.message);
                        alert( res.message);

                    }
                })

            }
            $scope.resolveTask=function(taskid){
                console.log(taskid);
               // /task/{id}/resolve
             /*   EngineApi.getTasks().resolve({
                    "id": taskid
                }, function(res) {
                    console.log(res);
                    $scope.task=res;
                    if (res.message) {
                        console.log(res.message);
                        alert( res.message);

                    }
                })*/

            }

            //查询到taskid,
            // bpm/api/default/bpm-rest-api/task?processInstanceId=2c0869ee-8100-11e5-b5b1-005056a100e8
            //在分配给那个
            $scope.AssigneeTask=function(taskid){
                console.log(taskid);
                if(User=="cassie") {
                    if ($scope.username) {
                        if (confirm("确定重新分配这个任务吗？")) {
                            EngineApi.getTasks().assignee({
                                "id": taskid
                            }, {"userId": $scope.username}, function (res) {
                                console.log(res);
                                $scope.task = res;
                                if (res.message) {
                                    console.log(res.message);
                                    alert(res.message);

                                }
                            })
                        }
                    } else {
                        Notifications.addError({'status': 'error', 'message': "请输入分配的工号"});
                    }
                }else{
                    Notifications.addError({'status': 'error', 'message': "你没有权限"});
                }
            }
            $scope.querytask=function(){
                if($scope.taskuserid) {
                    loadData($scope.taskuserid, function (res) {
                        $scope.usertasklist = res;
                    })
                }else{
                    Notifications.addError({'status': 'error', 'message': "请输入工号"});
                }
            }

            function loadData(userid,callback) {
                var tasklist = new Array();
                console.log(userid);
                EngineApi.getProxyUser().get({'userid': userid}).$promise.then(function (leavers) {
                    console.log(leavers);
                    if (leavers.length > 0) {
                        var leaver = leavers[0].UserId;
                        EngineApi.getTasks().query({"assignee": leaver, "sortBy": "created", "sortOrder": "desc"}).$promise.then(function (le_list) {
                            tasklist = le_list;
                            EngineApi.getTasks().query({'candidateUser': leaver}).$promise.then(function (le_candilist) {
                                for (var i = 0; i < le_candilist.length; i++) {
                                    tasklist.push(le_candilist[i]);
                                }
                                EngineApi.getTasks().query({"assignee": userid, "sortBy": "created", "sortOrder": "desc"}).$promise.then(function (list) {
                                    for (var i = 0; i < list.length; i++) {
                                        tasklist.push(list[i]);
                                    }
                                    EngineApi.getTasks().query({'candidateUser': userid}).$promise.then(function (candilist) {
                                        for (var i = 0; i < candilist.length; i++) {
                                            tasklist.push(candilist[i]);
                                        }
                                        //    console.log(tasklist);
                                        callback(tasklist);
                                    });
                                });

                            });
                        });
                    }
                    else {
                        EngineApi.getTasks().query({"assignee": userid, "sortBy": "created", "sortOrder": "desc"}).$promise.then(function (list) {
                            tasklist = list;
                            EngineApi.getTasks().query({'candidateUser': userid}).$promise.then(function (candilist) {
                                for (var i = 0; i < candilist.length; i++) {
                                    tasklist.push(candilist[i]);
                                }
                                console.log(tasklist);
                                callback(tasklist);
                            });
                        });
                    }
                })
            }
        }]);
});