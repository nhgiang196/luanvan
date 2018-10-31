
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller("formMaintainController", ['$q', 'Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService',
        function ($q, Auth, $scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService) {
            var isAdmin = Auth.nickname.indexOf('Administrator') != -1;
            $scope.lstc = [];
            $scope.lsgv = [];
            $scope.btCheckAuth = function (key, url) {
                EngineApi.getTcodeLink().get({ "userid": User, "tcode": key }, function (linkres) {
                    if (linkres.IsSuccess) {
                        $location.url(url);
                    } else {
                        Notifications.addError({ 'status': 'error', 'message': "You do not have permission！" });
                    }
                });

            }
            $q.all([loadGiangVien(), loadTcode()]).then(function (result) { }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });

            $scope.gv_change = function () {
                $scope.detaillist = [];
                THSAdminService.FindByID({ user: $scope.gv }, function (data) {
                    $scope.detaillist= data;
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('getError') + error
                    });
                })
            }
            /**
             * Load Combobox
             * */
            function loadTcode() {
                        var deferred = $q.defer();
                        var query = {
                            Table: 'Tcode',
                            lang: 'VN',
                        };
                        if (isAdmin)
                            query.bm = '';
                        else query.bm = Auth.bm;
                        THSAdminService.GetBasic(query, function (data) {
                            console.log(data)
                            $scope.lstc = data;
                            deferred.resolve(data);
                        }, function (error) {
                            deferred.resolve(error);
                        })
                    }
            function loadGiangVien() {
                        var deferred = $q.defer();
                        var query = {
                            Table: 'GiangVien',
                            lang: 'VN',
                        };
                        if (isAdmin)
                            query.bm = '';
                        else query.bm = Auth.bm;
                        THSAdminService.GetBasic(query, function (data) {
                            console.log(data)
                            $scope.lsgv = data;
                            deferred.resolve(data);
                        }, function (error) {
                            deferred.resolve(error);
                        })
                    }

            $scope.addItem = function () {
                        if ($scope.items != null || $scope.items != {}) {
                            var data = $scope.detaillist.filter(x => x.cm === $scope.items.cm);
                            if (data.length != 0) {
                                alert($scope.items + ": " + $translate.instant('waste_name_existed'));
                                // $scope.items = {};
                            } else {
                                var myitem = {}
                                myitem.gv = '';
                                myitem.cm = $scope.items.cm;
                                myitem.cmten = $('#cm option:selected').text();
                                $scope.detaillist.push(myitem);
                                $scope.items = {};
                            }
                        }
                    };
                $scope.deleteItem = function (index) {
                    $scope.detaillist.splice(index, 1);
                };



            }]);

});