define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('PhieuChamDiemController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            $scope.today = $filter('date')(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy");
            THSAdminService.ADC(
                {
                    st: "SELECT FORMAT(hdthoigian,'dd/MM/yyyy') as hdtgbv \
					,FORMAT(hdngaythanhlap,'dd/MM/yyyy') as hdngay,\
					hv.hv, hvhoten, cnten, tb1.lv, tb2.hd, UPPER(lvten) as lvten FROM DeTaiLV tb1\
					LEFT JOIN ChuyenNganh cn ON cn.cn= tb1.cn\
					LEFT JOIN HocVien hv ON hv.hv = tb1.hv\
					LEFT JOIN HDLV tb2 ON tb2.lv = tb1.lv\
					LEFT JOIN HDBVLV tb3 ON tb3.hd= tb2.hd\
					WHERE tb1.lv ='"+ $routeParams.lv + "'",
                }, function (data) {
                    console.log(data);
                    $scope.dtlist = {};
                    $scope.dtlist = data[0];
                }, function (error) {

                }
            )
        }
    ])
    myapp.controller('PhieuCauHoiController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            $scope.today = $filter('date')(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy");
            THSAdminService.ADC(
                {
                    table: '',
                    value: $routeParams.lv
                }, function (data) {
                    console.log(data);
                    $scope.dtlist = {};
                    $scope.dtlist = data[0];
                }, function (error) {

                }
            )
        }
    ])
    myapp.controller('rpHDLVController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            $scope.today = $filter('date')(new Date(), "'ngày' dd 'tháng' MM 'năm' yyyy");
            THSAdminService.ADC({
                st: "SELECT  tb1.*, cnten, hvhoten, cn.bm, tb2.*,  gvhoten,  FORMAT(hdthoigian,'dd/MM/yyyy HH:mm') as hdthoigian FROM DeTaiLV tb1 \
                LEFT JOIN ChuyenNganh cn ON cn.cn= tb1.cn\
                LEFT JOIN HocVien hv ON hv.hv = tb1.hv\
                LEFT JOIN HDLV tb2 ON tb2.lv = tb1.lv\
                LEFT JOIN HDBVLV tb3 ON tb3.hd= tb2.hd\
                LEFT JOIN CTHDLV tb4 ON tb4.hd = tb3.hd\
                LEFT JOIN GiangVien tb5 ON tb5.gv = tb4.gv\
					WHERE tb1.lv ='"+ $routeParams.lv + "'",
            }, function (data) {
                console.log(data);
                $scope.h= data[0];
                $scope.d= data;
                // lv	cm	qd	cn	hv	lvloai	nk	lvten	lvtomtat	
                // lvngaynop	lvluutru	status	createby	modifyby	ctime	
                // mtime	cnten	bm	hd	lv	diem	ykien	ketqua	lanbaove	sophieudat	gvhoten
            })

        }
    ])

    $(document).ready(function () {
        setTimeout(function () {
            window.print();
        }, 1000);
    })

})