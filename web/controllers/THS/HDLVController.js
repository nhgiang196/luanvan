define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('HDLVController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'HDLVService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, HDLVService, $translate, $q, $scope, $routeParams) {
            var lang = window.localStorage.lang;
            $scope.flowkey = "Mhd";
            $scope.recod = {};
            $scope.onlyOwner = true;
            $scope.status = '';
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                totalItems: 0,
                sort: null
            };
            $scope.cthd = [];
            $scope.cthd[0] = {}; $scope.cthd[0].gv = '';
            $scope.cthd[1] = {}; $scope.cthd[1].gv = '';
            $scope.cthd[2] = {}; $scope.cthd[2].gv = '';
            $scope.cthd[3] = {}; $scope.cthd[3].gv = '';
            $scope.cthd[4] = {}; $scope.cthd[4].gv = '';
            $scope.cthd[0].vaitro = 'Chủ tịch hội đồng';
            $scope.cthd[1].vaitro = 'Ủy viên';
            $scope.cthd[2].vaitro = 'Thư ký';
            $scope.cthd[3].vaitro = 'Phản biện 1';
            $scope.cthd[4].vaitro = 'Phản biện 2';
            $scope.detaillist = [];
            $(".key").prop('disabled', true);
            $scope.recod = {};
            /**
             * Init data
             */
            $scope.lsgv = [];
            $scope.lsdt = [];
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
            $q.all([loadGiangVien(), loadLuanVan()]).then(function (result) { }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load Combobox
             * */
            function loadGiangVien() {
                var deferred = $q.defer();
                var query = {
                    Table: 'GiangVien',
                    lang: lang,
                };
                if (Auth.nickname == 'Administrator')
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
            function loadLuanVan() {
                var deferred = $q.defer();
                var query = {
                    Table: 'DeTaiLuanVan',
                    lang: lang,
                };
                if (Auth.nickname == 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    $scope.lsdt = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            /**
             * Define All Columns in UI Grid
             */
            var col = [{
                field: 'hd',
                minWidth: 80,
                displayName: $translate.instant('hd'),
                cellTooltip: true,
                visible: true,
                cellTemplate: '<a href="javascript:void(0)" ng-click="grid.appScope.UpdateFunction(row.entity.hd)">{{row.entity.hd}}</a>'
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
                field: 'hdten',
                minWidth: 100,
                displayName: $translate.instant('hdten'),
                cellTooltip: true
            },
            {
                field: 'hdngaythanhlap',
                minWidth: 100,
                displayName: $translate.instant('hdngaythanhlap'),
                cellTooltip: true
            },
            {
                field: 'hdngayketthuc',
                minWidth: 100,
                displayName: $translate.instant('hdngayketthuc'),
                cellTooltip: true
            },
            {
                field: 'hddiadiem',
                minWidth: 100,
                displayName: $translate.instant('hddiadiem'),
                cellTooltip: true
            },
            {
                field: 'hdthoigian',
                minWidth: 100,
                displayName: $translate.instant('hdthoigian'),
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
            function loadDetails(id) {
                HDLVService.FindByID({
                    hd: id
                }, function (data) {
                    $scope.recod = data.Header[0];
                    $scope.cthd[0].gv = data.CTHDLV[0].gv || ''; //chủ tịch
                    $scope.cthd[3].gv = data.CTHDLV[1].gv || ''; //phản biện 1
                    $scope.cthd[4].gv = data.CTHDLV[2].gv || ''; //phản biện 2
                    $scope.cthd[2].gv = data.CTHDLV[3].gv || ''; //thư ký
                    $scope.cthd[1].gv = data.CTHDLV[4].gv || ''; //ủy viên
                    $scope.detaillist = [];
                    data.HDLV.forEach(element => {
                        var x = {};
                        x.lv = element.lv;
                        x.lvten = element.lv + '-' + element.lvten;
                        x.diem = element.diem;
                        x.lanbaove = element.lanbaove;
                        x.sophieudat = element.sophieudat;
                        x.ketqua = element.ketqua;
                        x.sophieudat = element.sophieudat;
                        x.ykien = element.ykien;
                        $scope.detaillist.push(x);
                    })
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('load_error') + error
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
                enableFiltering: true,
                showGridFooter: false,
                enableGridMenu: true,
                enableSelectAll: false,
                enableRowHeaderSelection: true,
                enableRowSelection: true,
                multiSelect: false,
                paginationPageSizes: [50, 100, 200, 500],
                paginationPageSize: 50,
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
                    // gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    //     $scope.selectedSupID = row.entity.SupID;
                    // });
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
                    $scope.cthd[0].gv = '';
                    $scope.cthd[1].gv = '';
                    $scope.cthd[2].gv = '';
                    $scope.cthd[3].gv = '';
                    $scope.cthd[4].gv = '';
                    $scope.status = 'N';
                    $('#myModal').modal('show');
                },
                order: 1
            }, {
                title: $translate.instant('Update'),
                action: function () {
                    $scope.UpdateFunction('');
                },
                order: 2
            },
            {
                title: $translate.instant('Delete'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();
                    // if (resultRows[0].UserID == Auth.username) {
                    if (resultRows.length == 1) {
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].hd)) {
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
                //             var href = '#/waste/Voucher/print/' + resultRows[0].hd;
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
                    hd: entity.hd,
                    createby: entity.createby
                };
                HDLVService.Delete(data, function (res) {
                    if (res.Success) {
                        Notifications.addMessage({
                            'status': 'information',
                            'message': $translate.instant('Delete_Success_MSG')
                        });
                        $timeout(function () {
                            $scope.Search()
                        }, 1000);
                    }
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': $translate.instant('deleteError') + error
                    });
                })
            };
            $scope.UpdateFunction = function (data) {
                var resultRows = $scope.gridApi.selection.getSelectedRows();
                $scope.status = 'M'; //Set update Status
                if (data != '') {
                    $scope.keyM = true;
                    loadDetails(data);
                    $('#myModal').modal('show');
                    return;
                }
                else if (resultRows.length == 1) {
                    if (resultRows[0].Status != 'X') {
                        if (resultRows[0].createby == Auth.username || Auth.nickname.includes("Admin")) {
                            // $(".keyM").prop('disabled', true);
                            loadDetails(resultRows[0].hd);
                            $scope.keyM = false;
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


            }
            $scope.print = function (code) {

                var href = '#/THS/HDLV/printHDLV/' + code;
                window.open(href);
            }

            /**
             *search list function
             */
            function SearchList() {
                var query = {
                };
                query.hd = $scope.hd || '';
                query.lv = $scope.lv || '';
                query.gv = $scope.gv || '';
                query.tungay = $scope.bm || '';
                query.denngay = $scope.cm || '';
                query.status = $scope.s_status || '';
                // query.pageIndex = paginationOptions.pageNumber || '';
                // query.pageSize = paginationOptions.pageSize || '';
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
                HDLVService.Search(query, function (res) {
                    console.log(res);
                    $scope.gridOptions.data = res;
                    //deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
            }
            /**
             * Trigger option changedValue
             * @param {change value} item
             */
            $scope.reset = function () {
                $scope.recod = {};
                $scope.detaillist = [];
                $scope.keyM = false;
                $(".keyM").prop('disabled', false);
                $('#myModal').modal('hide');
            }
            $scope.addItem = function () {
                if ($scope.items != null || $scope.items != {}) {
                    var data = $scope.detaillist.filter(x => x.lv === $scope.items.lv);
                    if (data.length != 0) {
                        alert($scope.items + ": " + $translate.instant('waste_name_existed'));
                        // $scope.items = {};
                    } else {
                        var myitem = {}
                        myitem.hd = '';
                        myitem.cm = $scope.items.cm;
                        myitem.lv = $scope.items.lv;
                        myitem.lvten = $('#lv option:selected').text();
                        myitem.diem = $scope.items.diem;
                        myitem.lanbaove = $scope.items.lanbaove;
                        myitem.sophieudat = $scope.items.sophieudat;
                        myitem.ketqua = $scope.items.ketqua;
                        myitem.ykien = $scope.items.ykien;
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
                note.hd = $scope.recod.hd || '';
                note.hdten = $scope.recod.hdten || '';
                note.hdngaythanhlap = $scope.recod.hdngaythanhlap || '';
                note.hdngayketthuc = $scope.recod.hdngayketthuc || '';
                note.hddiadiem = $scope.recod.hddiadiem || '';
                note.hdthoigian = $scope.recod.hdthoigian || '';
                note.createby = Auth.username;
                note.CTHDLVs = $scope.cthd;
                note.HDLVs = $scope.detaillist;
                return note;
            }
            /**
             * Save
             */
            function Create(data) {
                HDLVService.Create(data, function (res) {
                    console.log(res)
                    if (res.Success) {
                        $('#myModal').modal('hide');
                        Notifications.addMessage({
                            'status': 'information',
                            'message': $translate.instant('Save_Success_MSG') + +res.Message
                        });
                        $timeout(function () {
                            $scope.Search()
                        }, 1000);
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
                HDLVService.Update(data, function (res) {
                    if (res.Success) {
                        $('#myModal').modal('hide');
                        Notifications.addMessage({
                            'status': 'information',
                            'message': $translate.instant('Save_Success_MSG') + +res.Message
                        });
                        $timeout(function () {
                            $scope.Search()
                        }, 1000);
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
            function checkerror() {
                var cthd = $scope.cthd;
                for (var i = 0; i < cthd.length - 1; i++) {
                    for (var j = i + 1; j < cthd.length; j++) {
                        if (cthd[i].gv == cthd[j].gv) {
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant('saveGVerror')
                            });
                            return true;
                        }
                    }
                }
            }
            $scope.saveSubmit = function () {
                var note = saveInitData();
                if (checkerror()) return;
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