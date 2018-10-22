define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller('GiangVienController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'THSAdminService', 'GiangVienService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, THSAdminService, GiangVienService, $translate, $q, $scope, $routeParams) {
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
            $scope.lscm = [];
            $scope.lsdv = [];
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
            $q.all([loadChuyenMon(),loadBoMon(),loadDonViNgoai()]).then(function (result) { }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load Combobox
             * */

            function loadBoMon() {
                var deferred = $q.defer();
                var query = {
                    Table: 'BoMon',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    $scope.lsbm = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            function loadDonViNgoai() {
                var deferred = $q.defer();
                var query = {
                    Table: 'DonViNgoai',
                    lang: lang,
                };
                if (Auth.nickname = 'Administrator')
                    query.bm = '';
                else query.bm = Auth.bm;
                THSAdminService.GetBasic(query, function (data) {
                    console.log(data)
                    $scope.lsdv = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            function loadChuyenMon() {
                var deferred = $q.defer();
                var query = {
                    Table: 'LinhVucChuyenMon',
                    lang: lang,
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
            /**
             * Define All Columns in UI Grid
             */

            var col = [{
                field: 'gv',
                minWidth: 80,
                displayName: $translate.instant('gv'),
                cellTooltip: true,
                visible: true
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
                field: 'gvhoten',
                minWidth: 100,
                displayName: $translate.instant('gvhoten'),
                cellTooltip: true
            },
            {
                field: 'gvgioitinh',
                minWidth: 100,
                displayName: $translate.instant('gvgioitinh'),
                cellTooltip: true
            },
            {
                field: 'gvchucdanh',
                minWidth: 100,
                displayName: $translate.instant('gvchucdanh'),
                cellTooltip: true
            },
            {
                field: 'gvngaydkdt',
                minWidth: 100,
                displayName: $translate.instant('gvngaydkdt'),
                cellTooltip: true
            },
            {
                field: 'gvnamcongtac',
                minWidth: 100,
                displayName: $translate.instant('gvnamcongtac'),
                cellTooltip: true
            },
            {
                field: 'gvquoctich',
                minWidth: 100,
                displayName: $translate.instant('gvquoctich'),
                cellTooltip: true
            },
            {
                field: 'gvngaysinh',
                minWidth: 100,
                displayName: $translate.instant('gvngaysinh'),
                cellTooltip: true
            },
            {
                field: 'gvnoio',
                minWidth: 100,
                displayName: $translate.instant('gvnoio'),
                cellTooltip: true
            },
            {
                field: 'gvsodienthoai',
                minWidth: 100,
                displayName: $translate.instant('gvsodienthoai'),
                cellTooltip: true
            },
            {
                field: 'gvhinhanh',
                minWidth: 100,
                displayName: $translate.instant('gvhinhanh'),
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
                GiangVienService.FindByID({
                    gv: id
                }, function (data) {
                    $scope.recod = data.Headers[0];
                    $scope.detaillist = [];
                    data.Details.forEach(element => {
                        var x = {};
                        x.cm = element.cm;
                        x.cnten = element.cmten;
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
                    $scope.recod.dv='TCT';
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
                                loadDetails(resultRows[0].gv);
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
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].gv)) {
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
                //             var href = '#/waste/Voucher/print/' + resultRows[0].gv;
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
                    gv: entity.gv,
                    createby: entity.createby
                };
                GiangVienService.Delete(data, function (res) {
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
                query.gv = $scope.gv || '';
                query.bm = $scope.bm || '';
                query.cm = $scope.cm || '';
                query.dv = $scope.dv || '';
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
                GiangVienService.Search(query, function (res) {
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
                    var data = $scope.detaillist.filter(x => x.cm === $scope.items.cm);
                    if (data.length != 0) {
                        alert($scope.items + ": " + $translate.instant('waste_name_existed'));
                        // $scope.items = {};
                    } else {
                        var myitem = {}
                        myitem.gv = '';
                        myitem.cm = $scope.items.cm;
                        myitem.cmten = $('#cm option:selected').text();
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
                note.gv = $scope.recod.gv || '';
                note.dv = $scope.recod.dv || '';
                note.bm = $scope.recod.bm || '';
                note.gvhoten = $scope.recod.gvhoten || '';
                note.gvgioitinh = $scope.recod.gvgioitinh || '';
                note.gvchucdanh = $scope.recod.gvchucdanh || '';
                note.gvnamcongtac = $scope.recod.gvnamcongtac || '';
                note.gvquoctich = $scope.recod.gvquoctich || '';
                note.gvngaysinh = $scope.recod.gvngaysinh || '';
                note.gvnoio = $scope.recod.gvnoio || '';
                note.gvsodienthoai = $scope.recod.gvsodienthoai || '';
                note.gveil = $scope.recod.gveil || '';
                note.gvhinhanh = $scope.recod.gvhinhanh || '';
                note.createby = Auth.username;
                note.CMGVs = $scope.detaillist;
                return note;
            }
            /**
             * Save
             */
            function Create(data) {
                GiangVienService.Create(data, function (res) {
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
                GiangVienService.Update(data, function (res) {
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