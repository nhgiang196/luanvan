/**
 * Created by wangyanyan on 14-3-5.
 */
define(['myapp', 'angular', 'bpmn'], function (myapp, angular, Bpmn) {
    myapp.controller("startController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'EngineApi', 'Notifications', '$rootScope', 'Auth', '$translatePartialLoader', '$translate', function ($scope, $http, $compile, $routeParams, $resource, $location, Forms, EngineApi, Notifications, $rootScope, Auth, $translatePartialLoader, $translate) {
        $http.defaults.headers.common['Authorization'] = Auth.username;
        var pdid = $routeParams.id,
            formVariables = $scope.formVariables = [];
        var historyVariable = $scope.historyVariable = [];
        EngineApi.getStart().start({"id": pdid}, function (res) {
            if (res.message) {
                Notifications.addError({'status': 'error', 'message': res.message});
                return;
            }
            if (res.formkey) {
                console.log(res.formkey);
                $scope.definitionID = res.definitionID;
                console.log($scope.definitionID);
                $http.get(res.formkey).success(function (data, status, headers, config) {
                    $("#bindHtml").html(data);
                    var newScope = $scope.$new();
                    $compile($("#bindHtml").contents())($scope.$new());
                });
            } else {
                Notifications.addError({
                    'status': 'error',
                    'message': "No form to start, set the start form in the process"
                });

            }
        });
        //show 流程图
        $scope.$on('menuBarLoad', function () {
            //父级能得到值
            $scope.$broadcast('tomenuBarLoad', pdid, "");
            //  alert(pdid);
        });
        $scope.submitkey = function (businessKey) {
            $scope.businessKey = businessKey;
            $scope.submit();
        };
        var variablesMap = {};
        $scope.submitBykey = function (businessKey, callback) {
            $scope.businessKey = businessKey;
            variablesMap = Forms.variablesToMap(formVariables);
            historyVariable = Forms.variablesToMap(historyVariable);

            var datafrom = {
                formdata: variablesMap,
                businessKey: $scope.businessKey,
                historydata: historyVariable
            };
            console.log(datafrom);
            EngineApi.doStart().start({"id": $scope.definitionID}, datafrom).$promise.then(function (res) {
                console.log(res);
                if (res.message) {
                    callback({'status': 'error', 'message': res.message});
                    return;
                }
                if (!res.result) {
                    callback({'status': 'error', 'message': res.message});
                } else {
                    var result = JSON.parse(res.result);
                    console.log(result.id);

                    callback({'status': 'info', 'message': result.id});
                }
            }, function (errResponse) {
                callback({'status': 'error', 'message': errResponse});
            });
        };
        $scope.$on('historyurl', function (d, data) {
            $scope.historyurl = data;
        });

        $scope.submit = function () {
            variablesMap = Forms.variablesToMap(formVariables);
            historyVariable = Forms.variablesToMap(historyVariable);

            var datafrom = {
                formdata: variablesMap,
                businessKey: $scope.businessKey,
                historydata: historyVariable
            };
            console.log(datafrom);
            EngineApi.doStart().start({"id": $scope.definitionID}, datafrom, function (res) {
                console.log(res);
                if (res.message) {
                    Notifications.addMessage({'status': 'info', 'message': res.message});
                    return;
                }
                if (!res.result) {
                    Notifications.addMessage({'status': 'info', 'message': res.message});
                } else {
                    var result = res.result;
                    console.log(result);
                    $location.url("/taskForm/" + res.url);
                }
            })

        }


    }]);


    myapp.controller("loadController", ['$scope', '$rootScope', 'EngineApi', '$location', function ($scope, $rootScope, EngineApi, $location) {
        $scope.menuBar = true;
        $scope.bindform = true;

        $scope.toggleCustom = function () {
            //   alert("0o");
            $scope.menuBar = $scope.menuBar === false ? true : false;
            $(".pinned").toggle(function () {
                $(this).addClass("highlight");
                $(this).next().fadeOut(1000);
            }, function () {
                $(this).removeClass("highlight");
                $(this).next("div .content").fadeIn(1000);
            });
        };
        $scope.showPng = function () {
            $scope.$emit('menuBarLoad');

        };


        $scope.bpmn = {};
        $scope.$on('tomenuBarLoad', function (d, flowid, taskid) {
            var diagram = $scope.bpmn.diagram;
            console.log(flowid);         //子级得不到值
            // var pdid="checkForm:1:0381187d-aa59-11e3-a11f-0c84dc2d23b0";
            if (taskid) {
                if ($scope.bindform) {
                    EngineApi.getTasks().get({"id": taskid}, function (task) {
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
                        EngineApi.getProcessDefinitions().xml({id: flowid}, function (result) {
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
                    });
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
                    EngineApi.getProcessDefinitions().xml({id: flowid}, function (result) {
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