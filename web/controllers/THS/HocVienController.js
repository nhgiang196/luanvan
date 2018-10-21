define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('HocVienController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'HocVienService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, HocVienService, $translate, $q, $scope, $routeParams) {
            var lang = window.localStorage.lang;
            $scope.flowkey = "MHV";
            $scope.recod = {};
            $scope.onlyOwner = true;
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
            $scope.lscn = [];
            $scope.lsnk = [];
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
            $q.all([loadChuyenNganh(),loadNienKhoa()]).then(function (result) {}, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load Combobox
             * */

            function loadNienKhoa() {
                var deferred = $q.defer();
                var query = {
                    Table: 'NienKhoa',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    $scope.lsnk = data;
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
                    $scope.lscn = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            /**
             * Define All Columns in UI Grid
             */

            var col = [{
                    field: 'hv',
                    minWidth: 80,
                    displayName: $translate.instant('hv'),
                    cellTooltip: true,
                    visible: true,
                    filter: {
                        condition: function (searchTerm, cellValue) {
                            return cellValue.match(/a/);
                        }
                    }
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
                    field: 'hvhoten',
                    minWidth: 100,
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
                    field: 'hvgioitinh',
                    minWidth: 100,
                    displayName: $translate.instant('hvgioitinh'),
                    cellTooltip: true
                },
                {
                    field: 'hvngaysinh',
                    minWidth: 100,
                    displayName: $translate.instant('hvngaysinh'),
                    cellTooltip: true
                },
                {
                    field: 'hvngaydkdt',
                    minWidth: 100,
                    displayName: $translate.instant('hvngaydkdt'),
                    cellTooltip: true
                },
                {
                    field: 'hvngaydkbv',
                    minWidth: 100,
                    displayName: $translate.instant('hvngaydkbv'),
                    cellTooltip: true
                },
                {
                    field: 'hvquequan',
                    minWidth: 100,
                    displayName: $translate.instant('hvquequan'),
                    cellTooltip: true
                },
                {
                    field: 'hvsodienthoai',
                    minWidth: 100,
                    displayName: $translate.instant('hvsodienthoai'),
                    cellTooltip: true
                },
                {
                    field: 'hveil',
                    minWidth: 100,
                    displayName: $translate.instant('hveil'),
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
                    // cellTemplate: '<span >{{grid.appScope.getDate(row.entity.ctime)}}</span>'
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
                    // cellTemplate: '<span >{{grid.appScope.getDate(row.entity.mtime)}}</span>'
                },
            ];
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
                HocVienService.FindByID({
                    hv: id
                }, function (data) {
                    $scope.recod = data.Headers[0];
                    $scope.detaillist = [];
                    data.Details.forEach(element => {
                        var x = {};
                            x.cn = element.cn;
                            x.cnten = element.cn+'-'+element.cnten;
                            x.bm = element.bm;
                            x.nk = element.nk;
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
                enableFiltering: false,
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
                        $scope.status = 'N';
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
                                    loadDetails(resultRows[0].hv);
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
                            if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].hv)) {
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
                //             var href = '#/waste/Voucher/print/' + resultRows[0].hv;
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
                    hv: entity.hv,
                    createby: entity.createby
                };
                HocVienService.Delete(data, function (res) {
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
                query.hv = $scope.hv || '';
                query.cn = $scope.cn || '';
                query.nk = $scope.nk || '';
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
                HocVienService.Search(query, function (res) {
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
            $scope.reset = function () {
                $scope.recod = {};
                $scope.detaillist = [];
                $(".keyM").prop('disabled', false);
                $('#myModal').modal('hide');
            }
            $scope.addItem = function () {
                if ($scope.items != null || $scope.items != {}) {
                    var data = $scope.detaillist.filter(x => x.cn === $scope.items.cn);
                    if (data.length != 0) {
                        alert($scope.items + ": " + $translate.instant('waste_name_existed'));
                        // $scope.items = {};
                    } else {
                        var myitem = {}
                        myitem.hv = '';
                        myitem.cn = $scope.items.cn;
                        myitem.bm = $scope.lscn.filter(x=>x.cn==myitem.cn)[0].bm;
                        myitem.nk = $scope.items.nk;
                        myitem.cnten = $('#cn option:selected').text();
                        myitem.nkten = $('#nk option:selected').text();
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
                note.hv = $scope.recod.hv || '';
                note.hvhoten = $scope.recod.hvhoten || '';
                note.hvgioitinh = $scope.recod.hvgioitinh || '';
                note.hvngaysinh = $scope.recod.hvngaysinh || '';
                note.hvngaydkdt = $scope.recod.hvngaydkdt || '';
                note.hvngaydkbv = $scope.recod.hvngaydkbv || '';
                note.hvquequan = $scope.recod.hvquequan || '';
                note.hvsodienthoai = $scope.recod.hvsodienthoai || '';
                note.hveil = $scope.recod.hveil || '';
                note.hvhinhanh = $scope.recod.hvhinhanh || '';
                note.createby = Auth.username;
                note.HocCNs = $scope.detaillist;
                return note;
            }
            /**
             * Save
             */
            function Create(data) {
                HocVienService.Create(data, function (res) {
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
                HocVienService.Update(data, function (res) {
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