
define(['app', 'bpmn'], function (app, Bpmn) {
    app.directive('showUser', ['$resource', 'EngineApi', function ($resource, EngineApi) {
        return function (scope, element, attrs) {

            if (attrs["showUser"]) {
                EngineApi.getMemberInfo().get({userid: attrs["showUser"]}, function (res) {
                    console.log(res.Name);
                    element.text(res.Name);
                });
            }
        }

    }]);
    function asyncLoop(iterations, func, callback) {
        var index = 0;
        var done = false;
        var loop = {
            next: function () {
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

            iteration: function () {
                return index - 1;
            },

            break: function () {
                done = true;
                callback();
            }
        };
        loop.next();
        return loop;
    }

    app.directive('showCandidate', ['$resource', 'EngineApi', function ($resource, EngineApi) {
        return {
            restrict: 'EAC',
            //  transclude: true,
            // scope: false,
            link: function ($scope, element, attrs) {
                $scope.Candidates = {};
                if (attrs['showCandidate']) {
                    var ss = JSON.parse(attrs['showCandidate']);
                    var ProcessName = ss.processDefinitionId.split(":")[0];
                    console.log('TEST: ' + ProcessName);
                    console.log('id: ' + ss.id);
                    EngineApi.getTasks().identitylinks({id: ss.id}).$promise.then(function (ress) {
                        $scope.Candidates = ress;
                        console.log('KKKKKKKKKK: ' + ress[0].userId);
                        asyncLoop(ress.length, function (loop) {
                            var i = loop.iteration();
                            EngineApi.GetByName().get({
                                userid: ress[i].userId,
                                ProcessName: ProcessName
                            }).$promise.then(function (res) {
                                console.log('TEST_TEST_TEST: ' + $scope.Candidates[i].ProxyUser);
                                if (res.length > 0) {
                                    $scope.Candidates[i].ProxyUser = res[0].ProxyUserId;
                                    console.log('TEST_TEST_TEST: ' + $scope.Candidates[i].ProxyUser);
                                }
                                loop.next();
                            }, function (errResponse) {

                            })
                        }, function () {

                        });
                        //for (var i = 0; i < ress.length; i++) {
                        //    console.log($scope.Candidates[i])
                        //    var candidate=$scope.Candidates[i];
                        //    EngineApi.GetByName().get({
                        //        userid: ress[i].userId,
                        //        ProcessName: ProcessName
                        //    }).$promise.then(function (res) {
                        //       console.log(i)
                        //       // $scope.Candidates[i].ProxyUser = res[0].ProxyUserId
                        //    }, function (errResponse) {
                        //
                        //    })
                        //}

                    }, function (errResponse) {

                    })

                }
            },
            templateUrl: '../TemplateViews/CandidateShowTemplate.html'
        }
    }]);
    /*    app.directive('showCurrentTask', ['$resource', 'EngineApi', function ($resource, EngineApi) {
     return {
     link: function (scope, element, attrs, ctrl) {
     element.bind('onclick', function (evt) {
     EngineApi.getTasks().getList({processInstanceId: attrs["pid"]},function(ress){
     element.text(res.Name);
     })

     });
     }

     }


     }]);*/
    app.directive('fieldValidate', function () {
        var validate_class = "tq-validate";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {

                ctrl.validate = false;

                element.bind('focus', function (evt) {
                    if (ctrl.validate && ctrl.$invalid) {
                        element.addClass(validate_class);
                        scope.$apply(function () {
                            ctrl.validate = true;
                        });
                    }
                    else {
                        element.removeClass(validate_class);
                        scope.$apply(function () {
                            ctrl.validate = false;
                        });
                    }

                }).bind('blur', function (evt) {
                    element.addClass(validate_class);
                    scope.$apply(function () {
                        ctrl.validate = true;
                    });
                });
            }
        }
    });
    app.directive('historyField', ['Forms', function (Forms) {
        return {
            restrict: "A",
            require: 'ngModel',
            compile: function (scope, element, attrs, ctrl) {
                return {
                    pre: function preLink(scope, element, attrs, ctrl) {
                        console.log("----");
                    },
                    post: function postPost(scope, element, attrs, ctrl) {
                        var historyVariable = scope.historyVariable;

                        scope.$watch(attrs["ngModel"], function (value) {
                            var formFiled = {name: attrs["historyField"], value: value};
                            var variable = Forms.getVariableByName(attrs["historyField"], historyVariable);
                            if (variable == null) {

                                historyVariable.push(formFiled);
                            } else {
                                variable.value = value;
                            }
                        });
                    }
                }
            }
        }
    }]);

    app.directive('formField', ['Forms', function (Forms) {
        return {
            restrict: "A",
            require: 'ngModel',
            compile: function (ele, attrs, ctrl) {
                return {

                    pre: function preLink(scope, element, attrs, ctrl) {

                        /*   if( attrs["required"]) {
                         element.css("border-color", " #3c763d")
                         }*/
                    },
                    post: function postPost(scope, element, attrs, ctrl) {
                        var formVariables = scope.formVariables;

                        scope.$watch(attrs["ngModel"], function (value) {

                            var formFiled = {name: attrs["name"], value: value};
                            //   console.log(formFiled);
                            // scope.variable[attrs["name"]] = value;
                            //    scope.variable=scope.variable ||{};
                            //  formVariables.push(formFiled);
                            var variable = Forms.getVariableByName(attrs["name"], formVariables);
                            if (variable == null) {

                                formVariables.push(formFiled);
                            } else {
                                variable.value = value;
                            }

                        });
                    }
                }
            }
        }
    }]);
    app.directive('require', function () {
        return {
            restrict: "E",
            replace: true,
            scope: true,
            template: '<div class="sub-error" ng-show="checkRequire()">{{"000"| translate}}</div>',
            link: function ($scope, $elem, $attrs) {
                $scope.checkRequire = function () {
                    var _form = $scope.$parent.subjectForm;
                    var _name = $elem.prevAll("input,textarea").eq(0).attr("name");
                    if (_form[_name].$dirty && _form[_name].$error.required)
                        return true;
                    return false;
                }
            }
        };
    });


    app.directive('datePicker', function () {
        return {
            restrict: 'AEC',
            require: '?ngModel',
            scope: {
                ngModel: '='
            },
            link: function ($scope, $elem, $attrs, ngModel) {
                var format = $attrs.time ? 'Y-m-d H:i' : 'Y-m-d';
                if ($attrs.readonly) {
                    $elem.css({
                        backgroundColor: "#fff",
                        cursor: "default"
                    });
                }
                $elem.datetimepicker({
                    lang: "en",
                    timepicker: $attrs.time || false,
                    step: $attrs.step || 60,
                    format: format,
                    closeOnDateSelect: true,
                  
                    validateOnBlur: true,
                    minDate: $attrs.min || false,
                    maxDate: $attrs.max || false,
                    onChangeDateTime: function (ct, $i) {
                        $scope.$apply(function () {
                            ngModel.$setViewValue(ct.dateFormat(format));
                            ngModel.modelValue = ct.dateFormat(format);
                            $scope.ngModel = ct.dateFormat(format);
                            ngModel.$render();
                        })

                    }
                });
            }
        }
    });

    app.directive('processDiagramPreview', ['$resource', 'EngineApi', function ($resource, EngineApi) {
        return {
            restrict: 'EAC',
            template: '<span ng-hide="$loaded">' +
            '  <i class="icon-loading"></i> loading process diagram...' +
            '</span>',
            link: function (scope, element, attrs) {
                console.log(attrs.flowKey);
                EngineApi.getKeyId().getkey({
                    "key": attrs.flowKey
                }, function (res) {
                    // var processDefinitionId= attrs.processDefinitionId;
                    console.log(res.id);
                    var processDefinitionId = res.id;
                    if (processDefinitionId) {
                        // set the element id to processDiagram_*
                        var elementId = 'processDiagram_' + processDefinitionId.replace(/[.|:]/g, '_');
                        element.attr('id', elementId);
                        console.log(elementId);
                        EngineApi.getProcessDefinitions().xml({id: processDefinitionId}, function (response) {

                            var xml = response.bpmn20Xml;
                            scope.$loaded = true;
                            try {
                                new Bpmn().render(xml, {
                                    diagramElement: element.attr('id'),
                                    width: parseInt(element.parent().css('min-width')),
                                    height: element.parent().height(),
                                    skipOverlays: true
                                });
                            } catch (exception) {
                                // console.log('Unable to render diagram for process definition ' + processDefinitionId + ', reason: ' + exception.message)
                                element.html('<div class="alert alert-error diagram-rendering-error">Unable to render process diagram.</div>');
                            }
                        });
                    }
                });


            }
        }
    }]);
    app.directive('showChecker', ['$resource', 'EngineApi', 'Auth', function ($resource, EngineApi) {
        return {
            restrict: 'EAC',
            link: function (scope, element, attrs) {
                if (attrs.userName) {
                    scope.users = attrs.userName.split(',');
                }
            },
            templateUrl: '../TemplateViews/ShowUsersTemplate.html'
        }
    }]);

    app.directive('leaderCheck', ['$resource', 'EngineApi', 'Auth', 'GateGuest', '$compile',
        function ($resource, EngineApi, Auth, GateGuest) {
            return {
                restrict: 'EAC',
                link: function (scope, element, attrs) {
                    console.log(attrs.userName);
                    console.log(attrs.flowKey);
                    attrs.$observe('checkDate', function (newValue) {
                        if (newValue) {
                            GetBPMCheckers();
                        }
                    });

                    attrs.$observe('kinds', function (newValue) {
                        if (newValue) {
                            GetBPMCheckers();
                        }

                    }, true);
                    GetBPMCheckers();
                    function GetBPMCheckers() {
                        GateGuest.GetGateCheckers().getCheckers({
                            owner: attrs.userName,
                            fLowKey: attrs.flowKey,
                            Kinds: attrs.kinds || '',
                            CheckDate: attrs.checkDate || NaN
                        }).$promise.then(function (leaderlist) {
                                //
                                scope.$loaded = true;
                                console.log(leaderlist);
                                var checkList = [];
                                for (var i = 0; i < leaderlist.length; i++) {
                                    checkList[i] = leaderlist[i].Person;
                                }
                                scope.$parent.checkList = checkList;
                                scope.checkList = checkList;
                                scope.leaderlist = leaderlist;

                            }, function (errormessage) {
                                console.log(errormessage);
                            })
                    }

                },
                templateUrl: '../TemplateViews/ShowLeaderTemplate.html'
            }
        }]);
});