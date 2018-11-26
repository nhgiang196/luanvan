define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('PhieuChamDiemController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            $scope.today = $filter('date')(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy");
            THSAdminService.FindByID(
                {
                    table: 'rpDTLV',
                    value: $routeParams.lv
                }, function (data) {
                    console.log(data);
                    $scope.dtlist = {};
                    $scope.dtlist = data[0];
                }, function (error) {

                }
            )
            $(document).ready(function () {
                setTimeout(function () {
                    window.print();
                }, 500);
            })


        }
    ])
})