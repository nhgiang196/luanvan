/**
 * Created by wangyanyan on 14-3-6.
 * 任务列表，代理任务，重要任务的区别
 *
 */
define(['myapp', 'angular', 'bpmn'], function (myapp, angular, Bpmn) {
    myapp.controller("todoController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'EngineApi', 'User', 'Notifications', '$q',
        function ($scope, $http, $compile, $routeParams, $resource, $location, Forms, EngineApi, User, Notifications, $q) {
            //1.
            function loadData(callback) {
                var toDoList = $scope.toDoList = {};
                var pdList = $scope.pdList = {};
                var keyList = $scope.keyList = new Array();

                //候选的用户任务也包含
                var ProxyUserList = function (le_list, userid) {
                    var newResult = [];
                    for (var a = 0; a < le_list.length; a++) {
                        var proxytask = le_list[a];
                        proxytask["tasktype"] = userid;
                        newResult.push(proxytask);
                    }
                    return newResult;
                }
                var CaProxyUserList = function (le_list) {
                    var newResult = [];
                    for (var a = 0; a < le_list.length; a++) {
                        var proxytask = le_list[a];
                        proxytask["tasktype"] = "caproxyuser";
                        newResult.push(proxytask);
                    }
                    return newResult;
                }

                var UserList = function (list) {
                    var newResult = [];
                    for (var i = 0; i < list.length; i++) {
                        var usertask = list[i];
                        usertask["tasktype"] = "usertask";
                        newResult.push(usertask);
                    }
                    return newResult;
                }


                function fetchgetProxyList(questions, callback) {
                    console.log(questions)
                   var promises = questions.map(function (question) {
                        return $http({
                            url: '/bpm/api/default/bpm-rest-api/task',
                            method: 'GET',
                            params: {
                                "assignee": question.UserId,
                                "processDefinitionKey": question.Name,
                                "sortBy": "created",
                                "sortOrder": "desc"
                            }
                        });

                    });
                    return $q.all(promises);
                }

                function cafetchgetProxyList(promises, questions) {
                    var lists = []
                    for (var i = 0; i < questions.length; i++)
                        EngineApi.getTasks().query({
                            "candidateUser": questions[i].UserId,
                            "processDefinitionKey": questions[i].Name,
                            "sortBy": "created",
                            "sortOrder": "desc"
                        }).$promise.then(function (list) {
                                lists = lists.concat(list);
                            })
                    return lists;
                }

                EngineApi.getProxyUser().get({'userid': User}).$promise.then(function (leavers) {
                    var grepromises = [];
                    var tasklist = new Array();
                    if (leavers.length > 0) {
                        for (var i = 0; i < leavers.length; i++) {
                            var userid = leavers[i].UserId
                            var name = leavers[i].Name
                            EngineApi.getTasks().query({
                                "candidateUser": userid,
                                "processDefinitionKey": name,
                                "sortBy": "created",
                                "sortOrder": "desc"
                            }).$promise.then(function (list) {
                                    var newarray = ProxyUserList(list, userid);
                                    grepromises = grepromises.concat(newarray);
                                    tasklist = tasklist.concat(newarray)
                                })
                        }
                        console.log(leavers)
                        var promise = fetchgetProxyList(leavers);
                        promise.then(function (proxydata) {
                            var promises = proxydata.map(function (grenp) {
                                var newarray = ProxyUserList(grenp.data,userid)
                                grepromises = grepromises.concat(newarray);
                                tasklist = tasklist.concat(newarray)
                            });

                        }, function (proreason) {
                            console.log(proreason);
                        });
                    }


                    EngineApi.getTasks().query({
                        "assignee": User,
                        "sortBy": "created",
                        "sortOrder": "desc"
                    }).$promise.then(function (list) {
                            for (var i = 0; i < list.length; i++) {
                                tasklist.push(list[i]);
                            }
                            EngineApi.getTasks().query({'candidateUser': User}).$promise.then(function (candilist) {
                                for (var i = 0; i < candilist.length; i++) {
                                    tasklist.push(candilist[i]);
                                }
                                TaskQuery(tasklist)
                            });
                        });

                })
                var mainCount, commonCount = 0

                function TaskQuery(list) {
                    callback(list.length);
                    //得到key
                    $.each(list, function (i, value) {
                        if (value.priority > 50) {
                            mainCount = mainCount + 1;
                        } else {
                            commonCount = commonCount + 1;
                        }
                        var key = list[i].processDefinitionKey = value.processDefinitionId.substring(0, value.processDefinitionId.indexOf(':'));
                        if ($.inArray(list[i].processDefinitionKey, keyList) == -1) {
                            keyList.push(list[i].processDefinitionKey);
                            toDoList[list[i].processDefinitionKey] = new Array();
                            toDoList[list[i].processDefinitionKey].push(list[i]);
                            getProcessName(key, function (data) {
                                pdList[list[i].processDefinitionKey] = data;
                            });
                        }
                        else {
                            toDoList[list[i].processDefinitionKey].push(list[i]);
                        }
                        ;
                    });
                    toDoList = sortTodoList(toDoList);
                    $scope.mainCount = mainCount;
                    $scope.commonCount = commonCount;
                };

            };
            function sortTodoList(todoList) {
                for (var i in todoList) {
                    todoList[i] = quickSort(todoList[i]);
                }
                return todoList;
            }

            var quickSort = function (arr) {
                if (arr.length <= 1) {
                    return arr;
                }
                var pivotIndex = Math.floor(arr.length / 2);
                var pivot = arr.splice(pivotIndex, 1)[0];
                var left = [];
                var right = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].created > pivot.created) {
                        left.push(arr[i]);
                    }
                    else {
                        right.push(arr[i]);
                    }
                }
                return quickSort(left).concat([pivot], quickSort(right));
            };

            function getProcessName(key, callback) {

                EngineApi.getProcessDefinitions().getDefinitionName({
                    id: "key",
                    operation: key
                }).$promise.then(function (data) {
                        callback(data);
                    })

            }


            loadData(function (counter) {
                $scope.counter = counter;
            })


            /* $scope.loadData = function () {
             loadData(function (counter) {
             $scope.counter = counter;
             });
             };*/
            //是否按照重要性显示
            $scope.isShow = false;
            $scope.show = function (type) {
                if (type === "main") {
                    $scope.isShow = true;
                } else {
                    $scope.isShow = false;
                }
                $("#nav-menu").children("li").removeClass("active");
                $(this).parent('li').addClass("active");
            }

        }]);
});