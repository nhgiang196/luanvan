/**
 * Created by wang.chen on 2016/12/16.
 */
/**
 * Created by wang.chen on 2016/12/16.
 */
define(['app', 'angular', 'moment'], function (app, angular, moment) {
    app.directive("autoComplete", ['GateGuest', 'Notifications', 'Auth', function (GateGuest, Notifications, Auth) {
        return {
            require: 'ngModel',
            compile: function ($elem, $attrs) {
                $elem.after("<div style='background-color:#ffffff;width:100%;z-index: 1;position:absolute'><ul class='ul-dropdown'><li style='cursor: pointer' ng-repeat='employee in employeeInfo' ng-click='chooseVal($index)'>{{employee.Name}}</li></ul></div>");
                return {
                    pre: function ($scope, iElem, iAttrs) {
                        $(".ul-dropdown").css({
                            display:'none',
                            border:'1px solid #000000',
                            width:'100%'
                        });
                        $(".ul-dropdown").hide();
                    },
                    post: function ($scope, iElem, iAttrs) {
                        $scope.$watch(iAttrs["ngModel"], function (n) {
                            n = n || "";
                            $scope.recod.start_name = $scope.recod.start_name ||"";
                            if ($scope.recod.start_name.length >= 2 && document.getElementById("EmployeeName").readOnly == false) {
                               // $elem.after("<ul class='ul-dropdown'><li ng-repeat='employee in employeeInfo' ng-click='chooseVal($index)'>{{employee.Name}}</li></ul>");
                                $scope.employeeInfo = [];
                                if (n.length >= 2) {

                                    //避免重复出现下拉框
                                    if (iAttrs.choose) {
                                        iAttrs.choose = false;
                                        return;
                                    }
                                    GateGuest.GuestBasic().getIDByName({
                                        UserID: Auth.username,
                                        Name: $scope.recod.start_name
                                    }).$promise.then(function (conres) {
                                            if(conres.length == 1){
                                                $scope.recod.start_name = conres[0].Name;
                                                $scope.recod.start_code = conres[0].EmployeeID;
                                                $scope.recod.DepartmentSpc = conres[0].Specification;
                                                $scope.employeeInfo = [];
                                                //iAttrs.choose = true;
                                                $(".ul-dropdown").hide();
                                                return
                                            }
                                            $scope.employeeInfo = conres;
                                            $(".ul-dropdown").show();
                                        }, function (errResponse) {
                                            Notifications.addError({
                                                'status': 'error',
                                                'message': errResponse
                                            });
                                        });
                                }
                                else {
                                    $scope.employeeInfo = [];
                                    $(".ul-dropdown").hide();
                                }
                            }
                        });
                        $scope.chooseVal = function (_index) {
                            var e = $scope.employeeInfo[_index];
                            $scope.recod.start_name = e.Name;
                            $scope.recod.start_code = e.EmployeeID;
                            $scope.recod.DepartmentSpc = e.Specification;
                            iAttrs.choose = true;
                            $(".ul-dropdown").hide();
                        }

                    }
                }
            }
        }
    }]);
})