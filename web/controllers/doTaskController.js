
/**
 * Created by wangyanyan on 14-3-6.
 *
 */
define(['myapp', 'angular','bpmn'], function(myapp, angular,Bpmn) {
    myapp.controller("doTaskController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'Notifications', 'EngineApi','Auth','GateGuest', function($scope, $http, $compile, $routeParams, $resource, $location, Forms, Notifications, EngineApi,Auth,GateGuest) {
        var taskid = $routeParams.taskid,
            pid = $routeParams.pid,
            formVariables = $scope.formVariables = [],
            historyVariable = $scope.historyVariable = [];
        var nextleadercheck=new Array();
        $scope.bpmnloaded=false;
        $scope.showPngg=function(){
            if ($scope.bpmnloaded == true) {
                $scope.bpmnloaded = false;
            } else {
                $scope.bpmnloaded = true;
            }

        }
        $scope.butmocsubit = false;
        function asyncLoop(iterations, func, callback) {
            var index = 0;
            var done = false;
            var loop = {
                next: function() {
                    if (done) {
                        return;
                    }
                    if (index < iterations) {
                        index++;
                        func(loop);

                    } else {
                        done = true;
                        callback();
                    }
                },

                iteration: function() {
                    return index - 1;
                },

                break: function() {
                    done = true;
                    callback();
                }
            };
            loop.next();
            return loop;
        }
        EngineApi.getTaskform().getForm({
            "id": taskid
        }, function(res) {
            if (res.message) {
                console.log(res.message);
                Notifications.addError({
                    'status': 'error',
                    'message': res.message
                });
                return;
            }

            $scope.taskid = res.taskid;

            $http.get(res.formkey).success(function(data, status, headers, config) {

                $("#bindHtml").html(data);
                var newScope = $scope.$new();
                $compile($("#bindHtml").contents())($scope.$new());
            });
            //show 流程图
            $scope.$on('menuBarLoad', function() {
                //父级能得到值
                $scope.$broadcast('tomenuBarLoad', "", taskid);
                //  alert(pdid);
            });
            var superQuery = {
                id: $routeParams.pid
            };
            EngineApi.gethistoryProcessList().get(superQuery, function(superreslist) {
                if (superreslist.superProcessInstanceId) {
                    var url = "#/processlog/" + superreslist.superProcessInstanceId + "/" + $routeParams.pid;
                } else {
                    var url = "#/processlog/" + $routeParams.pid;
                }
                console.log(url);
                $scope.historyurl = url;
            });
            /* $scope.$on('menu_historyLoad', function() {
                 //父级能得到值
                 $scope.$broadcast('to_menu_historyLoad', res.pid);
                 //  alert(pdid);
             });*/
            $scope.variable = res.data;
            $scope.processInstanceId = res.pid;
            var variablesMap = {};
            function SaveGuest(note, callback) {
                GateGuest.SaveGuest().save(note).$promise.then(function (res) {
                    var voucherid = res.VoucherID;
                    if (voucherid) {
                        $scope.recod.start_voucherid = voucherid;
                        callback(voucherid, "")

                    } else {
                        callback(voucherid, $translate.instant('saveError'))
                    }
                }, function (errormessage) {
                    callback("", errormessage)
                });
            }

            $scope.modalSubmit= function(){

                $('#warningModal').modal('hide');
                $('#messageModal').modal('hide');
                $('nextModalGateGuestupdate').modal('hide');
                setTimeout(function() {


                console.log("--do task---");
                    console.log(formVariables);
                variablesMap = Forms.variablesToMap(formVariables);
                historyVariable = Forms.variablesToMap(historyVariable)
                  //  console.log('TEST:  ' +variablesMap);
                console.log(variablesMap);
                var datafrom = {
                    formdata: variablesMap,
                    historydata: historyVariable
                };
                //   var datafrom = {
                //     formdata: $scope.variable
                //};
                EngineApi.doTask().complete({
                    "id": $scope.taskid
                }, datafrom, function(res) {
                    console.log(res);
                    if (res.message) {
                        Notifications.addError({
                            'status': 'error',
                            'message': res.message
                        });
                        return
                    }
                    if (!res.result) {
                        Notifications.addError({
                            'status': 'error',
                            'message': res.message
                        });
                    } else {

                        var url = "/taskForm/" + res.url + $scope.processInstanceId
                       $location.url(url);
                    }
                })
                }, 1000);
            }
            $scope.modalCancelUpdate= function(){
                $('#warningModal').modal('hide');
                $('#messageModal').modal('hide');
                $('#nextModalGateGuestupdate').modal('hide');

            }


            $scope.submit = function(status) {

                if(status=='checkout'){

                    variablesMap = Forms.variablesToMap(formVariables);
                    historyVariable = Forms.variablesToMap(historyVariable)
                    console.log(variablesMap);
                    var datafrom = {
                        formdata: variablesMap,
                        historydata: historyVariable
                    };
                    //   var datafrom = {
                    //     formdata: $scope.variable
                    //};
                    EngineApi.doTask().complete({
                        "id": $scope.taskid
                    }, datafrom, function(res) {
                        console.log(res);
                        if (res.message) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                            return
                        }
                        if (!res.result) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                        } else {

                            var url = "/taskForm/" + res.url + $scope.processInstanceId
                            $location.url(url);
                        }
                    })
                }
                if(status=='delete'){

                    variablesMap = Forms.variablesToMap(formVariables);
                    historyVariable = Forms.variablesToMap(historyVariable)
                    console.log(variablesMap);
                    var datafrom = {
                        formdata: variablesMap,
                        historydata: historyVariable
                    };
                    //   var datafrom = {
                    //     formdata: $scope.variable
                    //};
                    EngineApi.doTask().complete({
                        "id": $scope.taskid
                    }, datafrom, function(res) {
                        console.log(res);
                        if (res.message) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                            return
                        }
                        if (!res.result) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                        } else {

                            var url = "/taskForm/" + res.url + $scope.processInstanceId
                            $location.url(url);
                        }
                    })
                }
                if(status=='update'){




                    var list = new Array();
                    var getLeader = new Array();

                    var formValue= Forms.variablesToMap(formVariables);
                    if(formValue.start_kind=='2'){
                        $scope.modalSubmit();
                        return;
                    }
                    asyncLoop(formValue.GuestChecherArray.length, function (loops) {

                            asyncLoop(formValue.GuestChecherArray[loops.iteration()].split(',').length, function (loop) {

                                    if (formValue.GuestChecherArray[loops.iteration()].split(',').length == 1) {
                                        getLeader.push(formValue.GuestChecherArray[loops.iteration()]);
                                        loops.next();
                                    }
                                    else {
                                        if (getLeader.indexOf(formValue.GuestChecherArray[loop.iteration()]) == -1 && formValue.GuestChecherArray[loop.iteration()]!=undefined) {

                                            getLeader.push(formValue.GuestChecherArray[loop.iteration()]);


                                        }
                                        loop.next();
                                    }

                                },
                                function () {

                                });

                        },
                        function () {

                        });
                    console.log(getLeader.length);
                    for (var i = 0; i < getLeader.length; i++) {

                        if (getLeader[i].split(',').length == 1) {
                            //console.log(test[i].split(',')[key]);
                            if (getLeader[i] == Auth.username) {
                                list.push(getLeader[i + 1]);
                            }else{
                                if(list.indexOf(getLeader[0])==-1){
                                    list.push(getLeader[0]);
                                }

                            }
                        } else {
                            for (var key in getLeader[i].split(',')) {
                                // console.log(test[i].split(',')[key]);
                                if (getLeader[i].split(',')[key] == Auth.username) {
                                    if(getLeader[i + 1].split(',')[key]===undefined){

                                        list.push(getLeader[i + 1]);
                                    }else{
                                        list.push(getLeader[i + 1].split(',')[key]);
                                    }
                                }else{
                                    if(list.indexOf(getLeader[0])==-1){
                                        list.push(getLeader[0]);
                                    }

                                }
                            }
                        }
                    }
                    asyncLoop(list.length, function (loops) {
                            //console.log(list[loops.iteration()].split(',').length);
                            if(list[loops.iteration()].split(',').length>1){
                                asyncLoop(list[loops.iteration()].split(',').length, function (loop) {
                                        EngineApi.getMemberInfo().get({userid: list[loops.iteration()].split(',')[loop.iteration()]}, function (ress) {
                                           //   console.log(list[loops.iteration()].split(',')[loop.iteration()] +' -- '+ress.Name)
                                            nextleadercheck.push(list[loops.iteration()].split(',')[loop.iteration()] + ' -- ' + ress.Name);

                                            loop.next();
                                        });
                                },
                                    function () {

                                    });
                            }
                            else{
                                EngineApi.getMemberInfo().get({userid: list[loops.iteration()]}, function (ress) {
                                    //  console.log(list[loops.iteration()] +' -- '+ress.Name)
                                    nextleadercheck.push(list[loops.iteration()] + ' -- ' + ress.Name);

                                    loops.next();
                                });
                            }

                        },function () {


                        });
                    GateGuest.GuestBasic().checkUserBelongDyeing({
                        EmployeeID: Auth.username
                    }).$promise.then(function (res1) {
                            GateGuest.GuestBasic().getGuest({
                                VoucherID: res.data.VoucherID,
                                Language: window.localStorage.lang
                            }).$promise.then(function (resgetList) {
                                    var tesst = resgetList;
                                    if(resgetList[0].Region=='1'){
                                        if (res1[0].DepartmentID.substr(0, 3) == '512') {
                                            $scope.showMessageModal = '';
                                            $scope.listleadercheck = nextleadercheck;

                                            $('#messageModal').modal('show');
                                        } else {
                                            $scope.listleadercheck = nextleadercheck;

                                            $('#messageModal').modal('show');
                                        }
                                    }
                                     else {
                                        $scope.listleadercheck = nextleadercheck;
                                        $('#nextModalGateGuestupdate').modal('show');
                                    }


                                }, function () {

                                });
                        },function(){

                        });


                }
                if(status=='NO'){
                    variablesMap = Forms.variablesToMap(formVariables);
                    historyVariable = Forms.variablesToMap(historyVariable)
                    console.log(variablesMap);
                    var datafrom = {
                        formdata: variablesMap,
                        historydata: historyVariable
                    };
                    //   var datafrom = {
                    //     formdata: $scope.variable
                    //};
                    EngineApi.doTask().complete({
                        "id": $scope.taskid
                    }, datafrom, function(res) {
                        console.log(res);
                        if (res.message) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                            return
                        }
                        if (!res.result) {
                            Notifications.addError({
                                'status': 'error',
                                'message': res.message
                            });
                        } else {

                            var url = "/taskForm/" + res.url + $scope.processInstanceId
                            $location.url(url);
                        }
                    })
                }
                else {

                    if (Auth.username == 'FEPVNN0003' || Auth.username == 'FEPVNN0023') {
                        variablesMap = Forms.variablesToMap(formVariables);
                        historyVariable = Forms.variablesToMap(historyVariable)

                        var datafrom = {
                            formdata: variablesMap,
                            historydata: historyVariable
                        };
                        //   var datafrom = {
                        //     formdata: $scope.variable
                        //};
                        EngineApi.doTask().complete({
                            "id": $scope.taskid
                        }, datafrom, function (res) {
                            console.log(res);
                            if (res.message) {
                                Notifications.addError({
                                    'status': 'error',
                                    'message': res.message
                                });
                                return
                            }
                            if (!res.result) {
                                Notifications.addError({
                                    'status': 'error',
                                    'message': res.message
                                });
                            } else {

                                var url = "/taskForm/" + res.url + $scope.processInstanceId
                                $location.url(url);
                            }
                        })
                    } else {
                        if(status=='update'){

                        }else{
                            if (res.data.start_area == '1') {

                                GateGuest.GuestBasic().checkUserBelongDyeing({
                                    EmployeeID: Auth.username
                                }).$promise.then(function (res) {

                                        if (res[0].DepartmentID.substr(0, 3) == '513' || res[0].DepartmentID.substr(0, 3) == '519' || res[0].DepartmentID.substr(0, 3) == '511') {
                                            if (res[0].DepartmentID.substr(0, 3) == '519') {

                                                if (Auth.username == 'FEPVNN0023') {
                                                    variablesMap = Forms.variablesToMap(formVariables);
                                                    historyVariable = Forms.variablesToMap(historyVariable)
                                                    console.log(variablesMap);
                                                    var datafrom = {
                                                        formdata: variablesMap,
                                                        historydata: historyVariable
                                                    };
                                                    //   var datafrom = {
                                                    //     formdata: $scope.variable
                                                    //};
                                                    EngineApi.doTask().complete({
                                                        "id": $scope.taskid
                                                    }, datafrom, function (res) {
                                                        console.log(res);
                                                        if (res.message) {
                                                            Notifications.addError({
                                                                'status': 'error',
                                                                'message': res.message
                                                            });
                                                            return
                                                        }
                                                        if (!res.result) {
                                                            Notifications.addError({
                                                                'status': 'error',
                                                                'message': res.message
                                                            });
                                                        } else {

                                                            var url = "/taskForm/" + res.url + $scope.processInstanceId
                                                            $location.url(url);
                                                        }
                                                    })

                                                }
                                            }
                                            if (res[0].DepartmentID.substr(0, 3) == '511') {

                                                if (Auth.username == 'FEPVNN0003') {
                                                    variablesMap = Forms.variablesToMap(formVariables);
                                                    historyVariable = Forms.variablesToMap(historyVariable)
                                                    console.log(variablesMap);
                                                    var datafrom = {
                                                        formdata: variablesMap,
                                                        historydata: historyVariable
                                                    };
                                                    //   var datafrom = {
                                                    //     formdata: $scope.variable
                                                    //};
                                                    EngineApi.doTask().complete({
                                                        "id": $scope.taskid
                                                    }, datafrom, function (res) {
                                                        console.log(res);
                                                        if (res.message) {
                                                            Notifications.addError({
                                                                'status': 'error',
                                                                'message': res.message
                                                            });
                                                            return
                                                        }
                                                        if (!res.result) {
                                                            Notifications.addError({
                                                                'status': 'error',
                                                                'message': res.message
                                                            });
                                                        } else {

                                                            var url = "/taskForm/" + res.url + $scope.processInstanceId
                                                            $location.url(url);
                                                        }
                                                    })
                                                } else {


                                                }
                                            } else {


                                            }

                                        }
                                        else {

                                            variablesMap = Forms.variablesToMap(formVariables);
                                            historyVariable = Forms.variablesToMap(historyVariable)
                                            console.log(variablesMap);
                                            var datafrom = {
                                                formdata: variablesMap,
                                                historydata: historyVariable
                                            };

                                            EngineApi.doTask().complete({
                                                "id": $scope.taskid
                                            }, datafrom, function (res) {
                                                console.log(res);
                                                if (res.message) {
                                                    Notifications.addError({
                                                        'status': 'error',
                                                        'message': res.message
                                                    });
                                                    return
                                                }
                                                if (!res.result) {
                                                    Notifications.addError({
                                                        'status': 'error',
                                                        'message': res.message
                                                    });
                                                } else {

                                                    var url = "/taskForm/" + res.url + $scope.processInstanceId
                                                    $location.url(url);
                                                }
                                            })
                                        }
                                    }, function (errResponse) {
                                        Notifications.addError({'status': 'error', 'message': errResponse});
                                    });
                                var list = new Array();
                                var getLeader = new Array();

                                asyncLoop($scope.variable.GuestChecherArray.length, function (loops) {

                                        asyncLoop($scope.variable.GuestChecherArray[loops.iteration()].split(',').length, function (loop) {
                                                // console.log($scope.variable.GuestChecherArray[loop.iteration()]);
                                                if ($scope.variable.GuestChecherArray[loops.iteration()].split(',').length == 1) {
                                                    getLeader.push($scope.variable.GuestChecherArray[loops.iteration()]);
                                                    loops.next();
                                                }
                                                else {
                                                    if (getLeader.indexOf($scope.variable.GuestChecherArray[loop.iteration()]) == -1&&$scope.variable.GuestChecherArray[loop.iteration()]!=undefined) {

                                                        getLeader.push($scope.variable.GuestChecherArray[loop.iteration()]);


                                                    }
                                                    loop.next();
                                                }

                                            },
                                            function () {

                                            });

                                    },
                                    function () {

                                    });

                                for (var i = 0; i < getLeader.length; i++) {
                                    console.log(getLeader[i].split(',').length);
                                    if (getLeader[i].split(',').length == 1) {

                                        if (getLeader[i] == Auth.username) {
                                            if(getLeader[i+1] == Auth.username){

                                                if(list.indexOf(getLeader[i + 1])==-1&&getLeader[i + 1]!=undefined){
                                                    list.push(getLeader[i + 1]);
                                                }
                                            }else{
                                                if(list.indexOf(getLeader[i + 1])==-1&&getLeader[i + 1]!=undefined){
                                                    list.push(getLeader[i + 1]);
                                                }
                                            }

                                        }
                                        //}else{
                                        //    list.push(getLeader[0]);
                                        //}
                                    } else {
                                        for (var key in getLeader[i].split(',')) {
                                            // console.log(test[i].split(',')[key]);

                                            if (getLeader[i].split(',')[key] == Auth.username) {
                                                if(getLeader[i + 1]===undefined){

                                                }else{
                                                    if(getLeader[i + 1].split(',')[key]===undefined){

                                                        list.push(getLeader[i + 1]);
                                                    }else{
                                                        list.push(getLeader[i + 1].split(',')[key]);
                                                    }
                                                }

                                            }
                                            else{
                                                if( getLeader.length==1){

                                                }

                                            }
                                        }
                                    }
                                }
                                asyncLoop(list.length, function (loops) {
                                    console.log(list[loops.iteration()]);
                                    EngineApi.getMemberInfo().get({userid: list[loops.iteration()]}, function (ress) {
                                        if(nextleadercheck.indexOf(list[loops.iteration()] + ' -- ' + ress.Name)==-1){
                                            nextleadercheck.push(list[loops.iteration()] + ' -- ' + ress.Name);
                                        }
                                        loops.next();
                                    });

                                },function () {
                                    console.log('OK: '+ nextleadercheck);
                                    $scope.leaderchecker=nextleadercheck;
                                    if($scope.leaderchecker ==undefined||$scope.leaderchecker==''){
                                        variablesMap = Forms.variablesToMap(formVariables);
                                        historyVariable = Forms.variablesToMap(historyVariable)
                                        console.log(variablesMap);
                                        var datafrom = {
                                            formdata: variablesMap,
                                            historydata: historyVariable
                                        };

                                        EngineApi.doTask().complete({
                                            "id": $scope.taskid
                                        }, datafrom, function (res) {
                                            console.log(res);
                                            if (res.message) {
                                                Notifications.addError({
                                                    'status': 'error',
                                                    'message': res.message
                                                });
                                                return
                                            }
                                            if (!res.result) {
                                                Notifications.addError({
                                                    'status': 'error',
                                                    'message': res.message
                                                });
                                            } else {

                                                var url = "/taskForm/" + res.url + $scope.processInstanceId;
                                                $location.url(url);
                                            }
                                        })
                                    }else{

                                        $('#warningModal').modal('show');
                                    }


                                });




                            }
                            else {
                                console.log('33333');
                                variablesMap = Forms.variablesToMap(formVariables);
                                historyVariable = Forms.variablesToMap(historyVariable)
                                console.log(variablesMap);
                                var datafrom = {
                                    formdata: variablesMap,
                                    historydata: historyVariable
                                };

                                EngineApi.doTask().complete({
                                    "id": $scope.taskid
                                }, datafrom, function (res) {
                                    console.log(res);
                                    if (res.message) {
                                        Notifications.addError({
                                            'status': 'error',
                                            'message': res.message
                                        });
                                        return
                                    }
                                    if (!res.result) {
                                        Notifications.addError({
                                            'status': 'error',
                                            'message': res.message
                                        });
                                    } else {

                                        var url = "/taskForm/" + res.url + $scope.processInstanceId;
                                        $location.url(url);
                                    }
                                })
                            }

                        }


                        //Get list of leader check


                    }
                }





            }

        })
    }]);
    myapp.controller("loadController", ['$scope', '$rootScope', 'EngineApi', '$location', function($scope, $rootScope, EngineApi, $location) {
        $scope.menuBar = true;
        $scope.bindform = true;
        $scope.toggleCustom = function() {
            //   alert("0o");
            $scope.menuBar = $scope.menuBar === false ? true : false;
            $(".pinned").toggle(function() {
                $(this).addClass("highlight");
                $(this).next().fadeOut(1000);
            }, function() {
                $(this).removeClass("highlight");
                $(this).next("div .content").fadeIn(1000);
            });
        };
        $scope.showPng = function() {
            $scope.$emit('menuBarLoad');
        }

        $scope.bpmn = {};
        $scope.$on('tomenuBarLoad', function(d, flowid, taskid) {
            var diagram = $scope.bpmn.diagram;
            console.log(flowid); //子级得不到值
            // var pdid="checkForm:1:0381187d-aa59-11e3-a11f-0c84dc2d23b0";
            if (taskid) {
                if ($scope.bindform) {
                    EngineApi.getTasks().get({
                        "id": taskid
                    }, function(task) {
                        var oldTask = $scope.bpmn.task;
                        if (diagram) {
                            if (taskid == oldTask) {
                                return;
                            }
                        }
                        console.log("11111");
                        $scope.bpmn.task = taskid;
                        var taskDefinitionKey = task.taskDefinitionKey;
                        flowid = task.processDefinitionId;
                        EngineApi.getProcessDefinitions().xml({
                            id: flowid
                        }, function(result) {
                            var diagram = $scope.bpmn.diagram,
                                xml = result.bpmn20Xml;
                            if (diagram) {
                                diagram.clear();
                            }
                            var width = $('#diagram').width();
                            var height = $('#diagram').height();
                            diagram = new Bpmn().render(xml, {
                                diagramElement: 'diagram',
                                width: width,
                                height: 400
                            });
                            console.log(taskDefinitionKey);
                            diagram.annotation(taskDefinitionKey).addClasses(['bpmn-highlight']);
                            $scope.bpmn.diagram = diagram;
                        });
                    })
                    $scope.bindform = false;
                } else {
                    $scope.bindform = true;
                }
            } else {
                if ($scope.bindform) {
                    var diagram = $scope.bpmn.diagram;
                    var oldTask = $scope.bpmn.id;
                    $scope.bpmn = {};
                    if (diagram) {
                        // destroy old diagram
                        diagram.clear();
                        if (flowid == oldTask) {
                            return;
                        }
                    }
                    $scope.bpmn.id = flowid;
                    EngineApi.getProcessDefinitions().xml({
                        id: flowid
                    }, function(result) {
                        console.log(result);
                        var diagram = $scope.bpmn.diagram,
                            xml = result.bpmn20Xml;
                        if (diagram) {
                            diagram.clear();
                        }
                        var width = $('#diagram').width();
                        var height = $('#diagram').height();

                        diagram = new Bpmn().render(xml, {
                            diagramElement: 'diagram',
                            width: width,
                            height: 400
                        });
                        //  diagram.annotation(task.taskDefinitionKey).addClasses([ 'bpmn-highlight' ]);
                        $scope.bpmn.diagram = diagram;
                    });
                    $scope.bindform = false;
                } else {
                    $scope.bindform = true;
                }
            }
        });
    }]);
});