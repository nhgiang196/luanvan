
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.directive('createWasteItem', ['$filter', '$http',
        '$routeParams', '$resource', '$location', '$interval',
        'Notifications', 'Forms', 'Auth', 'uiGridConstants', 'EngineApi',
        'GateGuest', '$translate', '$q', 'WasteItemService',
        function ($filter, $http, $routeParams,
            $resource, $location, $interval, Notifications, Forms, Auth, uiGridConstants,
            EngineApi, GateGuest, $translate, $q, WasteItemService) {
            return {
                restrict: 'E',
                controller: function ($scope) {
                    $scope.flowkey = 'HW01';
                    $scope.username = Auth.username;
                    formVariables = $scope.formVariables = [];
                    historyVariable = $scope.historyVariable = [];
                    /**
                     * Init Data to save
                     */
                    function saveInitData() {
                        var note = {};
                        note.WasteID = $scope.recod.waste_id || '';
                        note.MethodID = $scope.recod.method_id;
                        note.CompID = $scope.recod.compid;
                        note.State = $scope.recod.state || '';
                        note.ItemCode = $scope.recod.item_code;
                        note.Description_TW = $scope.recod.description_TW || '';
                        note.Description_CN = $scope.recod.description_TW || '';
                        note.Description_VN = $scope.recod.description_VN || '';
                        note.Description_EN = $scope.recod.description_VN || '';
                        note.Status = $scope.recod.status || '0';
                        return note;
                    }
                    function updateByID(data) {
                        WasteItemService.UpdateWasteItem(data, function (res) {
                            if (res.Success) {
                                $scope.Search();
                                $('#myModal').modal('hide');
                                $('#messageModal').modal('hide');
                                $('#nextModal').modal('hide');
                            } else {
                                Notifications.addError({
                                    'status': 'error',
                                    'message': $translate.instant('saveError') + res.Message
                                });
                            }

                        },
                            function (error) {
                                Notifications.addError({
                                    'status': 'error',
                                    'message': $translate.instant('saveError') + error
                                });
                            })
                    }
                    function SaveItem(data) {
                        WasteItemService.CreateWasteItem(data, function (res) {
                            console.log(res)
                            if (res.Success) {
                                $scope.Search();
                                $('#myModal').modal('hide');
                                $('#messageModal').modal('hide');
                                $('#nextModal').modal('hide');
                            }
                            else {
                                Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + res.Message });
                            }

                        }, function (error) {
                            Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + error });
                        })
                    }
                    $scope.savesubmit = function () {
                        var note = saveInitData();
                        var status = $scope.status;
                        switch (status) {
                            case 'N':
                                SaveItem(note);
                                break;
                            case 'M':
                                updateByID(note);
                                break;
                            default:
                                SaveItem(note);
                                break;
                        }

                    };

                },
                templateUrl: './forms/EHS/WasteItem/createWasteItem.html'
            }
        }]);
});