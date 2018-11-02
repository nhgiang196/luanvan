
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller("formMaintainController", ['$q', 'Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService',
        function ($q, Auth, $scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService) {
            var isAdmin = Auth.nickname.indexOf('Administrator') != -1;
            $scope.isAdmin = isAdmin;
            $scope.username = Auth.username + '-' + Auth.nickname;
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
                query = {};
                query.table = 'PhanQuyen';
                query.user = $scope.gv;
                THSAdminService.FindByID(query, function (data) {
                    $scope.detaillist = data;
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
                    table: 'Tcode',
                    user: Auth.username,
                };
                if (isAdmin)
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.FindByID(query, function (data) {
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
                if ($scope.gv != '' && $scope.tc != '') {

                    var data = $scope.detaillist.filter(x => x.tcode === $scope.tc);
                    if ($scope.gv == Auth.username)
                        Notifications.addError({ 'status': 'error', 'message': "You can't grant yourself" });
                    else if (data.length != 0) {
                        Notifications.addError({ 'status': 'error', 'message': "Existed tcode" });
                    } else {
                        query = {
                            action: 'grant',
                            user: $scope.gv,
                            tcode: $scope.tc,
                            grantoption: $scope.grantoption || 'False',
                            usergrant: Auth.username
                        };
                        THSAdminService.GrantVoke(query, function () {
                            $scope.gv_change();
                        }, function (err) {
                            Notifications.addError({ 'status': 'error', 'message': "You do not have permission！" });
                        })
                    }
                }
                else Notifications.addError({ 'status': 'error', 'message': "Grant who?" });

            };
            $scope.deleteItem = function (mtcode) {
                if ($scope.gv == Auth.username)
                    Notifications.addError({ 'status': 'error', 'message': "You can't revoke yourself" });
                else {
                    query = {
                        action: 'revoke',
                        user: $scope.gv,
                        tcode: mtcode,
                        grantoption: $scope.grantoption || 'False',
                        usergrant: Auth.username
                    };
                    THSAdminService.GrantVoke(query, function () {
                        $scope.gv_change();
                    }, function (err) {
                        Notifications.addError({ 'status': 'error', 'message': "You do not have permission！" });
                    })

                }
            };
        }]);
});