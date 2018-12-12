
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
                    alert($translate.instant('Bạn chưa nhập tiêu đề và nội dung!'));
                    return;
                }
                query = {
                    from: Auth.username,
                    tobm: $scope.typeEmailCheck ? '' : $scope.tobm,
                    toemail: $scope.typeEmailCheck ? $scope.toemails : $scope.toemail,
                    subject: $scope.subject,
                    body: $scope.body
                }
                THSAdminService.SendMail(query, function (res) {
                    if (res.Success) {
                        $scope.subject = '';
                        $scope.body = '';
                        Notifications.addMessage({
                            'status': 'information',
                            'message': 'Gửi mail thành công'
                        });
                    }
                }, function (err) {
                    Notifications.addError({
                        'status': 'error', 'message': err.message
                    });
                })
            }
        }]);

    myapp.controller("nhapdiemDCController", ['$q', 'Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService', 'HDDCService',
        function ($q, Auth, $scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService, HDDCService) {

            reset();
            $scope.username = Auth.username;
            $q.all([loadLV()]);
            function loadLV() {
                THSAdminService.ADC({
                    st: "select * from HDDC dc JOIN DeTaiLV lv ON lv.lv=dc.lv where dc='" + $routeParams.hd + " '"
                }, function (data) {

                    console.log(data);
                    $scope.lslv = data;
                    $scope.info = data[0];

                })
            }
            function reset() {
                $scope.ct = [];
                $scope.ct[0] = {};
                $scope.ct[1] = {};
                $scope.ct[2] = {};
                $scope.ct[3] = {};
                $scope.ct[4] = {};
                $scope.ct[0].diem = '';
                $scope.ct[0].danhgia = '';
                $scope.ct[1].diem = '';
                $scope.ct[1].danhgia = '';
                $scope.ct[2].diem = '';
                $scope.ct[2].danhgia = '';
                $scope.ct[3].diem = '';
                $scope.ct[3].danhgia = '';
                $scope.ct[4].diem = '';
                $scope.ct[4].danhgia = '';
                $scope.duyet = false;

            }
            $scope.lv_changed = function (lv) {
                if (lv == null || lv == '') return;
                THSAdminService.ADC({
                    st: "select * from HDDC where dc='" + $routeParams.hd + "' and lv='" + lv + "' and  diem is not null"
                }, function (data) {
                    if (data.length > 0)
                        $scope.duyet = true;
                })
                reset();
                THSAdminService.ADC({
                    st: "select  ct.gv, gvhoten, vaitro, diem, danhgia from CTHDDC ct \
                    JOIN GiangVien g ON g.gv = ct.gv LEFT JOIN DIEMLV d ON d.mahd=ct.dc \
                    AND d.gv=ct.gv  AND lv='" + lv + "' where dc='" + $routeParams.hd + "' ORDER BY vaitro"                }, function (data) {
                    console.log(data);
                    if (data.length > 0) $scope.ct = data;
                    else {
                        data[0].gv = $scope.ct[0].gv;
                        data[1].gv = $scope.ct[1].gv;
                        data[2].gv = $scope.ct[2].gv;
                        data[3].gv = $scope.ct[3].gv;
                        data[4].gv = $scope.ct[4].gv;

                    }
                })
            }
            $scope.NhapDiem = function () {
                if (checkData()) {
                    var result = {};
                    result.resdetail = [];
                    result.lv = $scope.lv;
                    result.mahd = $scope.info.dc;
                    $scope.ct.forEach(element => {
                        var x = {};
                        x.gv = element.gv;
                        x.diem = element.diem;
                        x.danhgia = element.danhgia;
                        result.resdetail.push(x);
                    })
                    HDDCService.UpdateResult(result, function (res) {
                        if (res.Success)
                            Notifications.addMessage({
                                'status': 'information',
                                'message': 'Cập nhật điểm thành công'
                            });
                    }, function (err) {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('saveError')
                        });

                    })


                }
                else Notifications.addError({ 'status': 'error', 'message': 'Nhập sai thông tin điểm' });
            }
            function checkData() {
                var check = true;
                $scope.ct.forEach(x => {
                    if (!(x.diem >= 0 && x.diem <= 10)) {
                        check = false;
                    }
                })
                return check;

            }
            $scope.DuyetQuyTrinh = function () {
                if (checkData())
                    THSAdminService.ADC({
                        st: "EXEC Update_Result_Duyet '" + $routeParams.hd + "','" + $scope.lv + "'"
                    }, function () {
                        Notifications.addMessage({
                            'status': 'information',
                            'message': 'Duyệt thành công, luận văn sau khi duyệt không thể chỉnh sửa'
                        });
                    })


            }



        }]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    myapp.controller("nhapdiemLVController", ['$q', 'Auth', '$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Notifications', 'EngineApi', 'User', 'THSAdminService', 'HDDCService',
        function ($q, Auth, $scope, $http, $compile, $routeParams, $resource, $location, Notifications, EngineApi, User, THSAdminService, HDDCService) {

            reset();
            $scope.username = Auth.username;
            $q.all([loadLV()]);
            function loadLV() {
                THSAdminService.ADC({
                    st: "select * from HDLV hd JOIN DeTaiLV lv ON lv.lv=hd.lv where hd='" + $routeParams.hd + " '"
                }, function (data) {

                    console.log(data);
                    $scope.lslv = data;
                    $scope.info = data[0];

                })
            }
            function reset() {
                $scope.ct = [];
                $scope.ct[0] = {};
                $scope.ct[1] = {};
                $scope.ct[2] = {};
                $scope.ct[3] = {};
                $scope.ct[4] = {};
                $scope.ct[0].diem = '';
                $scope.ct[0].danhgia = '';
                $scope.ct[1].diem = '';
                $scope.ct[1].danhgia = '';
                $scope.ct[2].diem = '';
                $scope.ct[2].danhgia = '';
                $scope.ct[3].diem = '';
                $scope.ct[3].danhgia = '';
                $scope.ct[4].diem = '';
                $scope.ct[4].danhgia = '';
                $scope.duyet = false;

            }
            $scope.lv_changed = function (lv) {
                if (lv == null || lv == '') return;
                THSAdminService.ADC({
                    st: "select * from HDLV where hd='" + $routeParams.hd + "' and lv='" + lv + "' and  diem is not null"
                }, function (data) {
                    if (data.length > 0)
                        $scope.duyet = true;
                })
                reset();
                THSAdminService.ADC({
                    st: "select  ct.gv, gvhoten, vaitro, diem, danhgia from CTHDLV ct \
                    JOIN GiangVien g ON g.gv = ct.gv LEFT JOIN DIEMLV d ON d.mahd=ct.hd \
                    AND d.gv=ct.gv  AND lv='" + lv + "' where hd='" + $routeParams.hd + "' ORDER BY vaitro"
                }, function (data) {
                    console.log(data);
                    if (data.length > 0) $scope.ct = data;
                    else {
                        data[0].gv = $scope.ct[0].gv;
                        data[1].gv = $scope.ct[1].gv;
                        data[2].gv = $scope.ct[2].gv;
                        data[3].gv = $scope.ct[3].gv;
                        data[4].gv = $scope.ct[4].gv;

                    }
                })
            }
            $scope.NhapDiem = function () {
                if (checkData()) {
                    var result = {};
                    result.resdetail = [];
                    result.lv = $scope.lv;
                    result.mahd = $scope.info.hd;
                    $scope.ct.forEach(element => {
                        var x = {};
                        x.gv = element.gv;
                        x.diem = element.diem;
                        x.danhgia = element.danhgia;
                        result.resdetail.push(x);
                    })
                    HDDCService.UpdateResult(result, function (res) {
                        if (res.Success)
                            Notifications.addMessage({
                                'status': 'information',
                                'message': 'Cập nhật điểm thành công'
                            });
                    }, function (err) {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('saveError')
                        });

                    })


                }
                else Notifications.addError({ 'status': 'error', 'message': 'Nhập sai thông tin điểm' });
            }
            function checkData() {
                var check = true;
                $scope.ct.forEach(x => {
                    if (!(x.diem >= 0 && x.diem <= 10)) {
                        check = false;
                    }
                })
                return check;

            }
            $scope.DuyetQuyTrinh = function () {
                if (checkData())
                    THSAdminService.ADC({
                        st: "EXEC Update_Result_Duyet '" + $routeParams.hd + "','" + $scope.lv + "'"
                    }, function () {
                        Notifications.addMessage({
                            'status': 'information',
                            'message': 'Duyệt thành công, luận văn sau khi duyệt không thể chỉnh sửa'
                        });
                    })


            }



        }]);






});