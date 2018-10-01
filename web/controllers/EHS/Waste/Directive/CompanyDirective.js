
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.directive('createCompany', ['CompanyService', 'Auth', '$q',
        function (CompanyService, Auth, $q) {
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
                        note.CompID = $scope.recod.comp_id || '';
                        note.CompName = $scope.recod.comp_name;
                        note.CompCode = $scope.recod.comp_code;
                        note.Type = $scope.recod.type;
                        note.Phone = $scope.recod.phone;
                        note.Email = $scope.recod.email;
                        note.Address = $scope.recod.address;
                        note.Status = $scope.recod.status || '0';
                        return note;
                    }
                    /**
                     * Update status by updateByID
                     */
                    function updateByID(data) {
                        CompanyService.UpdateCompany(data, function (res) {
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
                     * Save Company
                     */
                    function SaveCompany(data) {
                        CompanyService.CreateCompany(data, function (res) {
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
                     * save submit Company
                     */
                    $scope.saveSubmit = function () {
                        var note = saveInitData();
                        var status = $scope.status;
                        switch (status) {
                            case 'N':
                                SaveCompany(note);
                                break;
                            case 'M':
                                updateByID(note);
                                break;
                            default:
                                SaveCompany(note);
                                break;
                        }

                    };
                },
                templateUrl: './forms/EHS/Company/createCompany.html'
            }
        }]);
});