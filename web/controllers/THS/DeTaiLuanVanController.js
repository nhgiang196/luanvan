define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('DeTaiLuanVanController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'DeTaiLuanVanService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, DeTaiLuanVanService, $translate, $q, $scope, $routeParams) {
            var lang = window.localStorage.lang;
            $scope.flowkey = "MLV";
            $scope.recod = {};
            $scope.onlyOwner = true;
            $scope.isError = false;
            $scope.status = '';
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                totalItems: 0,
                sort: null
            };
            $scope.detaillist = [];
            $(".key").prop('disabled', true);
            $scope.recod = {};
            /**
             * Init data
             */
            var full_lscn = [];
            var full_lshv = [];
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
            $q.all([loadHocVien(), loadLinhVucChuyenMon(), loadChuyenNganh(), loadGiangVien()]).then(function (result) { }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load Combobox
             * */
            function loadHocVien() {
                var deferred = $q.defer();
                var query = {
                    Table: 'HocVien',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    full_lshv = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            function loadLinhVucChuyenMon() {
                var deferred = $q.defer();
                var query = {
                    Table: 'LinhVucChuyenMon',
                    lang: lang
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
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
                    Table: 'ChuyenNganh',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    full_lscn = data;
                    // $scope.lscn = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            function loadGiangVien() {
                var deferred = $q.defer();
                var query = {
                    Table: 'GiangVien',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
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
            /**
             * Define All Columns in UI Grid
             */
            var col = [{
                field: 'lv',
                minWidth: 80,
                displayName: $translate.instant('lv'),
                cellTooltip: true,
                visible: true,
                // cellTemplate: '<a href="#/waste/Voucher/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
            },
            {
                field: 'status',
                displayName: $translate.instant("Status"),
                minWidth: 110,
                cellTooltip: true,
                visible: true,
                cellTemplate: '<span >{{grid.appScope.getStatus(row.entity.status)}}</span>'
            },
            {
                field: 'qd',
                minWidth: 80,
                displayName: $translate.instant('qd'),
                cellTooltip: true
            },
            {
                field: 'hvhoten',
                minWidth: 150,
                displayName: $translate.instant('hvhoten'),
                cellTooltip: true
            },
            {
                field: 'cnten',
                minWidth: 100,
                displayName: $translate.instant('cnten'),
                cellTooltip: true
            },
            {
                field: 'lvten',
                displayName: $translate.instant('lvten'),
                minWidth: 150,
                cellTooltip: true,
                visible: true
            },
            {
                field: 'cmten',
                displayName: $translate.instant('cmten'),
                minWidth: 120,
                cellTooltip: true,
                visible: true
            },
            {
                field: 'lvloai',
                minWidth: 80,
                displayName: $translate.instant('lvloai'),
                cellTooltip: true
            },
            {
                field: 'nk',
                minWidth: 50,
                displayName: $translate.instant('nk'),
                cellTooltip: true
            },
            {
                field: 'lvngaynop',
                minWidth: 105,
                maxWidth: 105,
                displayName: $translate.instant('lvngaynop'),
                cellTooltip: true
            },
            {
                field: 'lvluutru',
                minWidth: 70,
                displayName: $translate.instant('lvluutru'),
                cellTooltip: true
            },
            {
                field: 'createby',
                minWidth: 80,
                displayName: $translate.instant('createby'),
                cellTooltip: true
            },
            {
                field: 'ctime',
                minWidth: 120,
                displayName: $translate.instant('ctime'),
                cellTooltip: true,
                cellTemplate: '<span >{{grid.appScope.getDate(row.entity.ctime)}}</span>'
            },
            {
                field: 'modifyby',
                minWidth: 80,
                displayName: $translate.instant('modifyby'),
                cellTooltip: true
            },
            {
                field: 'mtime',
                minWidth: 120,
                displayName: $translate.instant('mtime'),
                cellTooltip: true,
                cellTemplate: '<span >{{grid.appScope.getDate(row.entity.mtime)}}</span>'
            },
            ];
            $scope.getDate = function (date) {
                if (date != '')
                    return $filter('date')(date, 'yyyy-MM-dd hh:mm');
                else {
                    return date;
                }
            };
            $scope.getStatus = function (Status) {
                var statLen = $filter('filter')($scope.statuslist, {
                    'id': Status
                });
                if (statLen.length > 0) {
                    return statLen[0].name;
                } else {
                    return Status;
                }
            };
            /**
             * Load detail
             */
            function loadDetails(mylv) {
                DeTaiLuanVanService.FindByID({
                    lv: mylv
                }, function (data) {
                    // $scope.lshv = full_lshv.filter(x => x.lv == null); //Chưa có luận văn trong niên khóa và ngành hiện tại
                    // var templist = full_lshv.filter(x => x.lv == data.Header[0].lv)[0];
                    // $scope.lshv.push(templist);
                    // $scope.lscn = full_lscn.filter(x=>x.cn== data.Header[0].cn);
                    //-----------------
                    $scope.lshv = full_lshv;
                    $scope.lscn = full_lscn.filter(x => x.cn == data.Header[0].cn);
                    $scope.recod = data.Header[0];
                    $scope.detaillist = [];
                    data.Details.forEach(element => {
                        var x = {};
                        var item = $scope.lsgv.filter(x => x.gv === element.gv);
                        if (item.length > 0) {
                            x.gv = item[0].gv;
                            x.gvhoten = item[0].gv + '-' + item[0].gvhoten;
                            x.gvchucdanh = item[0].gvchucdanh;
                            x.vaitrohuongdan = element.vaitrohuongdan;
                            $scope.detaillist.push(x);
                        }
                    })
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('loadHuongDanerror') + error
                    });
                })
            }
            /**
             * Query Grid setting
             */
            $scope.gridOptions = {
                columnDefs: col,
                data: [],
                enableColumnResizing: true,
                enableSorting: true,
                showGridFooter: false,
                enableGridMenu: true,
                exporterMenuPdf: false,
                enableSelectAll: false,
                enableRowHeaderSelection: true,
                enableRowSelection: true,
                multiSelect: false,
                paginationPageSizes: [50, 100, 200, 500],
                paginationPageSize: 50,
                enableFiltering: false,
                exporterOlderExcelCompatibility: true,
                useExternalPagination: true,
                enablePagination: true,
                enablePaginationControls: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    EngineApi.getTcodeLink().get({
                        'userid': Auth.username,
                        'tcode': $scope.flowkey
                    }, function (linkres) {
                        if (linkres.IsSuccess) {
                            gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
                        }
                    });
                    ///gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.selectedSupID = row.entity.SupID;
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        $scope.Search();
                    });
                }
            };
            var gridMenu = [{
                title: $translate.instant('Create'),
                action: function () {
                    $scope.reset();
                    $scope.status = 'N';
                    // $scope.company = full_lsCompany.filter(x => x.Status == 1); //gnote xử lý theo trạng thái đã hủy
                    $scope.lshv = full_lshv.filter(x => x.lv == null);
                    $('#myModal').modal('show');
                },
                order: 1
            }, {
                title: $translate.instant('Update'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();
                    $scope.status = 'M'; //Set update Status
                    if (resultRows.length == 1) {
                        if (resultRows[0].Status != 'X') {
                            if (resultRows[0].createby == Auth.username || Auth.nickname.includes("Admin")) {
                                // $(".keyM").prop('disabled', true);
                                loadDetails(resultRows[0].lv);
                                $('#myModal').modal('show');
                            } else {
                                Notifications.addError({
                                    'status': 'error',
                                    'message': $translate.instant('ModifyNotBelongUserID')
                                })
                            }
                        } else {
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant('Modified_to_X')
                            });
                        }
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('Select_ONE_MSG')
                        });
                    }
                },
                order: 2
            },
            {
                title: $translate.instant('Delete'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();
                    // if (resultRows[0].UserID == Auth.username) {
                    if (resultRows.length == 1) {
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].lv)) {
                            deleteById(resultRows[0]);

                        }
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('Select_ONE_MSG')
                        });
                    }
                    // } else {
                    //     Notifications.addError({
                    //         'status': 'error',
                    //         'message': $translate.instant('ModifyNotBelongUserID')
                    //     })
                    // }
                },
                order: 3
            },
                // {
                //     title: $translate.instant('PrintReport'),
                //     action: function () {
                //         var resultRows = $scope.gridApi.selection.getSelectedRows();
                //         if (resultRows.length == 1) {
                //             var href = '#/waste/Voucher/print/' + resultRows[0].lv;
                //             window.open(href);
                //         } else {
                //             Notifications.addError({
                //                 'status': 'error',
                //                 'message': $translate.instant('Select_ONE_MSG')
                //             });
                //         }
                //     },
                //     order: 4
                // }
            ];
            function deleteById(entity) {
                var data = {
                    lv: entity.lv,
                    createby: entity.createby
                };
                DeTaiLuanVanService.Delete(data, function (res) {
                    if (res.Success) {
                        Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Delete_Success_MSG') });
                        $timeout(function () { $scope.Search() }, 1000);
                    }
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('deleteError') + error
                    });
                })
            }
            /**
             *search list function
             */
            function SearchList() {
                var query = {
                    // userID: Auth.username,
                    // lang: lang,
                    // bm: Auth.bm
                };
                query.lv = $scope.lv || '';
                query.cm = $scope.cm || '';
                query.qd = $scope.qd || '';
                query.cn = $scope.cn || '';
                query.hv = $scope.hv || '';
                query.bm = $scope.bm || '';
                query.status = $scope.s_status || '';
                // query.pageIndex = paginationOptions.pageNumber || '';
                // query.pageSize = paginationOptions.pageSize || '';
                // if ($scope.onlyOwner == true)
                //     query.isCheck = 1;
                // else query.isCheck = 0;
                return query;
            }
            /**
             *Search function for Button Search
             */
            $scope.Search = function () {
                var deferred = $q.defer();
                // if (!$scope.checkErr()) {
                var deferred = $q.defer();
                var query = SearchList();
                DeTaiLuanVanService.Search(query, function (res) {
                    console.log(res);
                    $scope.gridOptions.data = res;
                    // $scope.gridOptions.data` = res.TableData[0];
                    // $scope.gridOptions.totalItems = res.TableCount[0];
                    //deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
            }
            /**
             * Trigger option changedValue
             * @param {change value} item
             */
            $scope.changeValueHV = function (hv) {
                //console.log(item);
                $scope.recod.nk = '';
                $scope.lscn = [];
                $scope.recod.cn = '';
                var data = $scope.lshv.filter(x => x.hv === hv);
                if (data.length > 0) {
                    data.forEach(element => {
                        var mylist = {};
                        var item = full_lscn.filter(x => x.cn === element.cn);
                        if (item.length > 0) {
                            mylist.cn = item[0].cn;
                            mylist.cnten = item[0].cnten;
                            $scope.lscn.push(mylist);
                        }
                    })
                }
            }
            $scope.changeValueCN = function (cn) {
                var data = $scope.lshv.filter(x => x.hv === $scope.recod.hv && x.cn === cn);
                $scope.recod.nk = data[0].nk;
            }
            $scope.changeCheckValue = function () {
                $scope.lshv = full_lshv.filter(x => $scope.check.value1? x.lv ==null:true
                    &&  $scope.check.value2? x.bm ==Auth.bm:true);
            }
            $scope.reset = function () {
                $scope.recod = {};
                $scope.detaillist = [];
                $(".keyM").prop('disabled', false);
                $('#myModal').modal('hide');
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
            /** 
             */
            $scope.addItem = function () {
                if ($scope.items != null || $scope.items != {}) {
                    var data = $scope.detaillist.filter(x => x.gv === $scope.items.gv);
                    if (data.length != 0) {
                        alert($scope.items + ": " + $translate.instant('waste_name_existed'));
                        // $scope.items = {};
                    } else {
                        var myitem = {}
                        myitem.lv = '';
                        myitem.gv = $scope.items.gv;
                        myitem.gvhoten = $('#gvhoten option:selected').text();
                        myitem.gvchucdanh = $scope.lsgv.filter(x => x.gv === $scope.items.gv)[0].gvchucdanh;
                        myitem.vaitrohuongdan = 'Giảng viên hướng dẫn ' + ($scope.detaillist.length == 0 ? 'chính' : 'phụ');
                        $scope.detaillist.push(myitem);
                        $scope.items = {};
                    }
                }
            };
            $scope.deleteItem = function (index) {
                $scope.detaillist.splice(index, 1);
            };
            // ------------- DIRECTIVE -------------
            function saveInitData() {
                var note = {};
                note.lv = $scope.recod.lv || '';
                note.cm = $scope.recod.cm || '';
                note.qd = $scope.recod.qd || '';
                note.cn = $scope.recod.cn || '';
                note.hv = $scope.recod.hv || '';
                note.lvloai = $scope.recod.lvloai || '';
                note.lvtomtat = $scope.recod.lvtomtat || '';
                note.nk = $scope.recod.nk || '';
                note.lvten = $scope.recod.lvten || '';
                note.lvngaynop = $scope.recod.lvngaynop || '';
                note.lvluutru = $scope.recod.lvluutru || '';
                note.createby = Auth.username;
                note.HuongDans = $scope.detaillist;
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
            /**
             * Update status by updateByID
             */
            function updateByID(data) {
                DeTaiLuanVanService.Update(data, function (res) {
                    if (res.Success) {
                        $('#myModal').modal('hide');
                        Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Save_Success_MSG') + + res.Message });
                        $timeout(function () { $scope.Search() }, 1000);
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
             * save submit
             */
            $scope.saveSubmit = function () {
                var note = saveInitData();
                var status = $scope.status;
                switch (status) {
                    case 'N':
                        Create(note);
                        break;
                    case 'M':
                        updateByID(note);
                        break;
                    default:
                        Create(note);
                        break;
                }
            };
        }
    ])
})