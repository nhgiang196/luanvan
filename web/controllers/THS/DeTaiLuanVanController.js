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
            $("#key").prop('disabled', true);
            $scope.recod = {};

            /**
             * Init data
             */
            // var full_lsWastItems = [];
            // var full_lsWastItems = [];
            // var full_lsCompany = [];
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
            }
            ];
            $q.all([loadHocVien(), loadLinhVucChuyenMon(), loadChuyenNganh()]).then(function (result) {
            }, function (error) {
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
                    lang: lang
                };
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data);
                    $scope.lshv = data;
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
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data);
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
                    lang: lang
                };
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data);
                    $scope.lscn = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            /**
             * Define All Columns in UI Grid
             */
            var col = [
                {
                    field: 'lv',
                    minWidth: 120,
                    displayName: $translate.instant('lv'),
                    cellTooltip: true,
                    visible: true,
                    // cellTemplate: '<a href="#/waste/Voucher/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
                },
                {
                    field: 'cmten',
                    displayName: $translate.instant('cmten'),
                    minWidth: 120,
                    cellTooltip: true,
                    visible: true
                },
                {
                    field: 'qd',
                    minWidth: 100,
                    displayName: $translate.instant('qd'),
                    cellTooltip: true
                },
                {
                    field: 'cnten',
                    minWidth: 100,
                    displayName: $translate.instant('cnten'),
                    cellTooltip: true
                },
                {
                    field: 'hvhoten',
                    minWidth: 100,
                    displayName: $translate.instant('hvhoten'),
                    cellTooltip: true
                },
                {
                    field: 'lvloai',
                    minWidth: 100,
                    displayName: $translate.instant('lvloai'),
                    cellTooltip: true
                },
                {
                    field: 'nk',
                    minWidth: 100,
                    displayName: $translate.instant('nk'),
                    cellTooltip: true
                },
                {
                    field: 'lvten',
                    minWidth: 100,
                    displayName: $translate.instant('lvten'),
                    cellTooltip: true
                },
                {
                    field: 'lvtomtat',
                    minWidth: 100,
                    displayName: $translate.instant('lvtomtat'),
                    cellTooltip: true
                },
                {
                    field: 'lvngaynop',
                    minWidth: 100,
                    displayName: $translate.instant('lvngaynop'),
                    cellTooltip: true
                },
                {
                    field: 'lvluutru',
                    minWidth: 100,
                    displayName: $translate.instant('lvluutru'),
                    cellTooltip: true
                },
                {
                    field: "status",
                    displayName: $translate.instant("Status"),
                    minWidth: 150,
                    cellTooltip: true,
                    visible: true,
                    cellTemplate: '<span >{{grid.appScope.getStatus(row.entity.status)}}</span>'
                },
            ];
            $scope.getStatus = function (Status) {
                var statLen = $filter('filter')($scope.StatusList, { 'id': Status });
                if (statLen.length > 0) {
                    return statLen[0].name;
                } else {
                    return Status;
                }
            };
            /**
             * Load detail
             */
            function loadDetails(entity) {
                DeTaiLuanVanService.FindByID({ lv: entity.lv }, function (data) {
                    $scope.recod.lv = data.Header[0].lv;
                    $scope.recod.qd = data.Header[0].qd;
                    $scope.recod.hv = data.Header[0].hv;
                    $scope.recod.lvloai = data.Header[0].lvloai;
                    $scope.recod.nk = data.Header[0].nk;
                    $scope.recod.lvten = data.Header[0].lvten;
                    $scope.recod.lvtomtat = data.Header[0].lvtomtat;
                    $scope.recod.lvngaynop = data.Header[0].lvngaynop;
                    $scope.recod.lvluutru = data.Header[0].lvluutru;
                    $scope.recod.cn = lscn.filter(x => x.cnten == data.Header[0].cnten)[0].cn;
                    $scope.recod.cm = lscm.filter(x => x.cmten == data.Header[0].cmten)[0].cm;
                    $scope.recod.hvhoten = lshv.filter(x => x.hvhoten == data.Header[0].hvhoten)[0].hv;
                    $scope.detail_lsgv = [];
                    data.Details.forEach(element => {
                        var x = {};
                        var item = lsgv.filter(x => x.gv === element.gv);
                        if (item.length > 0) {
                            x.gv = item[0].gv;
                            x.gvhoten = item[0].gvhoten;
                            x.vaitro = element.vaitro;
                            $scope.detail_lsgv.push(x);
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
                    $('#myModal').modal('show');
                },
                order: 1
            }, {
                title: $translate.instant('Update'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();
                    $scope.recod.comp_id = resultRows
                    $scope.status = 'M'; //Set update Status
                    if (resultRows.length == 1) {
                        if (resultRows[0].Status != 'X') {
                            if (resultRows[0].UserID == Auth.username) {
                                var querypromise = loadDetails(resultRows[0].lv);
                                // $scope.company = full_lsCompany;
                                querypromise.then(function () {
                                    $('#myModal').modal('show');
                                }, function (error) {
                                    Notifications.addError({
                                        'status': 'error',
                                        'message': error
                                    });
                                })
                            }
                            else {
                                Notifications.addError({ 'status': 'error', 'message': $translate.instant('ModifyNotBelongUserID') })
                            }
                        }
                        else {
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
                    if (resultRows[0].UserID == Auth.username) {
                        if (resultRows.length == 1) {
                            if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].lv)) {
                                deleteById(resultRows[0].lv);
                            }
                        } else {
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant('Select_ONE_MSG')
                            });
                        }
                    }
                    else {
                        Notifications.addError({ 'status': 'error', 'message': $translate.instant('ModifyNotBelongUserID') })
                    }
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
            function deleteById(id) {
                var data = {
                    lv: id
                };
                DeTaiLuanVanService.Delete(data, function (res) {
                    if (res.Success) {
                        $scope.Search();
                        $('#myModal').modal('hide');
                        Notifications.addError({
                            'status': 'information',
                            'message': $translate.instant('deleteSuccess') + res.Message
                        });

                    }
                },
                    function (error) {
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
                query.lv = '';
                query.cm = '';
                query.qd = '';
                query.cn = '';
                query.hvten = '';
                query.lvten = '';

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
            $scope.changedValue = function (item) {
                //console.log(item);
                var data = full_lsWastItems.filter(x => x.WasteID === item);
                if (data.length > 0) {
                    $scope.gd.method_name = data[0].MethodDescription;
                    $scope.gd.waste_name = data[0].WasteDescription;
                }
            }
            $scope.reset = function () {
                $scope.recod = {};
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
                if ($scope.gd != null || $scope.gd != {}) {
                    var data = $scope.wasteItems.filter(x => x.waste_name === $scope.gd.waste_name);

                    if (data.length != 0) {
                        alert($scope.gd.waste_name + ": " + $translate.instant('waste_name_existed'));
                        $scope.gd = {};
                    } else {
                        if ($scope.gd.Quantity < 0 || $scope.gd.Weight <= 0) {
                            alert($scope.gd.waste_name + ": " + $translate.instant('positive_quantity_weight'));
                            $scope.gd.Quantity = null;
                            $scope.gd.Weight = null;
                        } else {
                            $scope.wasteItems.push($scope.gd);
                            $scope.gd = {};
                        }
                    }
                }
            };
            $scope.deleteItem = function (index) {
                $scope.wasteItems.splice(index, 1);

            };


            // ------------- DIRECTIVE -------------
            function saveInitData() {
                var note = {};
                note.lv = $scope.recod.lv;
                note.cm = $scope.recod.cm || '';
                note.qd = $scope.recod.qd || '';
                note.cn = $scope.recod.cn || '';
                note.hv = $scope.recod.hv || '';
                note.lvloai = $scope.recod.lvloai || '';
                note.nk = $scope.recod.nk || '';
                note.lvten = $scope.recod.lvten || '';
                note.lvngaynop = $scope.recod.lvngaynop || '';
                note.lvluutru = $scope.recod.lvluutru || '';
                return note;
            }
            /**
             * Save
             */
            function Create(data) {
                DeTaiLuanVanService.Create(data, function (res) {
                    console.log(res)
                    if (res.Success) {
                        $scope.Search();
                        $('#myModal').modal('hide');
                        Notifications.addError({
                            'status': 'information',
                            'message': $translate.instant('saveSucess') + res.Message
                        });
                    }
                }, function (error) {
                    Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + error });
                })
            }
            /**
             * Update status by updateByID
             */
            function updateByID(data) {
                DeTaiLuanVanService.Update(data, function (res) {
                    if (res.Success) {
                        $('#myModal').modal('hide');
                        $scope.Search();
                        Notifications.addError({
                            'status': 'information',
                            'message': $translate.instant('updateSucess') + res.Message
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
        }])
})