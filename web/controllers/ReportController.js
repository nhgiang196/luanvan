
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller("EmailSenderController", ['$q', 'Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService',
        function ($q, Auth, $scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService) {
            $scope.typeEmailCheck = false;
            $q.all([loadbm()]);
            function loadbm() {
                THSAdminService.GetBasic({ Table: 'BoMon', bm: '' }, function (data) {
                    $scope.lsbm = data;
                }, function (errormessage) {
                    Notifications.addError({
                        'status': 'error',
                        'message': errormessage
                    });
                });
            }

            $scope.tobm_change = function (value) {
                if (value == '' || value == null) {
                    $scope.lshv = [];
                    return;
                }
                THSAdminService.GetBasic({ Table: 'HocVien', bm: value }, function (data) {
                    $scope.lshv = data;
                }, function (errormessage) {
                    Notifications.addError({
                        'status': 'error',
                        'message': errormessage
                    });
                });
            }
            $scope.SendMail = function () {
                if ($scope.subject == null || $scope.body == null || $scope.subject == '' || $scope.body == '') {
                    alert($transla`te`.instant('Bạn chưa nhập tiêu đề và nội dung!'));
                    return;
                }
                query = {
                    from: Auth.username,
                    tobm: $scope.typeEmailCheck ? '' : $scope.tobm,
                    toemail: $scope.typeEmailCheck ? $scope.toemails : $scope.toemail,
                    subject: $scope.subject,
                    body: $scope.body
                }
                THSAdminService.SendMail(query, function () {
                    Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Gửi mail thành công!') });
                }, function (err) {
                    Notifications.addError({
                        'status': 'error', 'message': err.message
                    });
                })


            }


        }]);


});