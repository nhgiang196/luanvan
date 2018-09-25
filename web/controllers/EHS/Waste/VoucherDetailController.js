define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('VoucherDetailController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'VoucherService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, VoucherService, $translate, $q, $scope, $routeParams) {

            /**
             * Report init
             */
            $scope.VoucherID = $routeParams.code; //param
            $scope.voucherItemDetail = [];
            $scope.voucher = {};
            var lang = window.localStorage.lang; //language
            $scope.date1 = $filter('date')(new Date(), "dd/MM/yyyy");
            $scope.date2 = $filter('date')(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy");


            /**Get voucher and voucher detail  */
            $q.all([loadHeader(), loadDetail()]).then(function (result) {
                console.log(result);
            }, function (error) {
                Notifications.addError({ 'status': 'Failed', 'message': 'Loading failed: ' + error });
            });
            function loadHeader() {
                var deferred = $q.defer();
                VoucherService.GetVoucher({ VoucherID: $scope.VoucherID }, function (data) {
                    $scope.voucher = data[0];
                }, function (error) {
                    deferred.reject(error);
                })
            }
            function loadDetail() {
                var deferred = $q.defer();
                VoucherService.GetVoucherDetail({ VoucherID: $scope.VoucherID }, function (data) {
                    $scope.voucherItemDetail = data;
                }, function (error) {
                    deferred.reject(error);
                })
            }

            /** PRINT REPORT */
            function PrintReport() {
                var printContents = printContents = document.getElementById('myprint').innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                printContents.reject();
            }
            
            $('.container').css({ 'padding-top': '0px' });
            $(document).ready(function () {
                setTimeout(function () {
                    window.print(); 
                }, 500);
            })

        }])
})
