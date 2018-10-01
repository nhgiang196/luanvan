
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.directive('createMethod', ['MethodProcessService', 'Auth', '$q',
        function (MethodProcessService, Auth, $q) {
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
                        note.MethodID = $scope.recod.method_id || '';
                        note.MethodName = $scope.recod.method_name;
                        note.Description_EN = $scope.recod.description_VN;
                        note.Description_TW = $scope.recod.description_TW || $scope.recod.description_VN;
                        note.Description_CN = $scope.recod.description_TW || $scope.recod.description_VN;
                        note.Description_VN = $scope.recod.description_VN;
                        note.Status = $scope.recod.status || '0';
                        return note;
                    }
                    /**
                     * Update status by updateByID
                     */
                    function updateByID(data) {
                        MethodProcessService.UpdateMethod(data, function (res) {
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
                    /**
                     * Save Method
                     */
                    function SaveMethod(data) {
                        MethodProcessService.CreateMethod(data, function (res) {
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
                    /**
                     *reset data function
                     */
                    $scope.reset = function () {
                        $scope.recod = {};
                        $('#myModal').modal('hide');
                    }
                    /**
                     * save submit Method
                     */
                    $scope.saveSubmit = function () {
                        var note = saveInitData(); //Gán các recod data vào note
                        var status = $scope.status;
                        switch (status) {
                            case 'N':
                                SaveMethod(note);
                                break;
                            case 'M':
                                updateByID(note);
                                break;
                            default:
                                SaveMethod(note);
                                break;
                        }

                    };
                },
                templateUrl: './forms/EHS/Method/createMethod.html'
            }
        }]);
});