define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('DangKyLuanVanController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            var lang = window.localStorage.lang;
            var isStudent = Auth.username.indexOf('MS') != -1;
            var bm = '';
            if (!isStudent) return;
            $scope.recod = {};
            $scope.isError = false;
            $scope.status = '';
            $(".key").prop('disabled', true);
            /**
             * Init data
             */
            $scope.lshv = [];
            $scope.lscm = [];
            $scope.lscn = [];
            $scope.statuslist = [{
                id: 'N',
                name: $translate.instant('StatusN')
            },
            {
                id: 'M',
                name: $translate.instant('StatusM')
            },
            {
                id: 'X',
                name: $translate.instant('StatusX')
            },
            ];
            $q.all([loadLinhVucChuyenMon(), loadChuyenNganh()]).then(function (result) { }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load Combobox
             * */
            function loadLinhVucChuyenMon() {
                var deferred = $q.defer();
                var query = {
                    Table: 'LinhVucChuyenMon',
                    lang: lang
                };
                query.bm = '';
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    $scope.lscm = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            function loadChuyenNganh() {
                var deferred = $q.defer();
                var query = {
                    st: "select * from ChuyenNganh c JOIN HocCN h ON c.cn=h.cn where hv='" + Auth.username + "'  and NOT EXISTS (SELECT * FROM DeTaiLV dt WHERE h.hv=dt.hv AND dt.cn=h.cn)"
                };
                THSAdminService.ADC(query, function (data) {
                    console.log(data);
                    $scope.lscn = data;
                    // $scope.lscn = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            // function loadGiangVien() {
            //     var deferred = $q.defer();
            //     var query = {
            //         Table: 'GiangVien',
            //         lang: lang,
            //         bm: ''
            //     };
            //     THSAdminService.ADC(query, function (data) {
            //         console.log(data)
            //         $scope.lsgv = data;
            //         deferred.resolve(data);
            //     }, function (error) {
            //         deferred.resolve(error);
            //     })
            // }
            $scope.changeValueCN = function (cn) {
                var data = $scope.lscn.filter(x => x.cn === cn);
                $scope.recod.nk = data[0].nk;
                bm = data[0].bm;
            }
            $scope.changeValueCM = function (cm) {

                THSAdminService.ADC({
                    st: "select * from GiangVien where gv in (select gv FROM CMGV WHERE cm='" + cm + "') AND bm='" + bm + "'"
                }, function (data) {
                    console.log(data);
                    $scope.lsgv = data;
                })
            }
            $scope.reset = function () {
            }
            /**
             * Kiểm tra ngày bắt đầu phải < ngày kết thúc
             * Và các check nhỏ khác
             */
            // $scope.checkErr = function () {
            //     var startDate = $scope.dateFrom;
            //     var endDate = $scope.dateTo;
            //     $scope.errMessage = '';
            //     if (new Date(startDate) > new Date(endDate)) {
            //         $scope.isError = true;
            //         $scope.errMessage = 'End Date should be greater than Start Date';
            //         Notifications.addError({
            //             'status': 'error',
            //             'message': $scope.errMessage
            //         });
            //         return true;
            //     }
            //     return false;
            // };
            
            // ------------- DIRECTIVE -------------
            function saveInitData() {
                var note = {};
                note.cm = $scope.recod.cm || '';
                note.cn = $scope.recod.cn || '';
                note.hv = Auth.username;
                
                note.lvloai = 'MS';
                note.lvtomtat = $scope.recod.lvtomtat || '';
                note.nk = $scope.recod.nk || '';
                note.lvten = $scope.recod.lvten || '';
                note.createby = Auth.username;
                var detaillist = [];
                detaillist.push({lv:'',gv: $scope.recod.gv, vaitrohuongdan:'Giảng viên hướng dẫn chính (đăng ký)'})
                note.HuongDans =detaillist;
                return note;
            }
            /**
             * Save
             */
            function Create(data) {
                DeTaiLuanVanService.Create(data, function (res) {
                    console.log(res)
                    if (res.Success) {
                        $('#myModal').modal('hide');
                        Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Save_Success_MSG') + + res.Message });
                        $timeout(function () { $scope.Search() }, 1000);
                    }
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('saveError') + error
                    });
                })
            }

            $scope.saveSubmit = function () {
                var note = saveInitData();
                Create(note);
            };
        }
    ])
})