define(['myapp', 'controllers/EHS/Waste/Directive/VoucherDirective', 'angular'], function (myapp, angular) {
    myapp.controller('ChuyenMonController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'VoucherService', 'WasteItemService', 'CompanyService', '$translate', '$q', '$scope', '$routeParams',
        function ($filter, Notifications, Auth, EngineApi, VoucherService, WasteItemService, CompanyService, $translate, $q, $scope, $routeParams) {
            var lang = window.localStorage.lang;
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
            var full_lsWastItems = [];
            var full_lsCompany = [];
            $scope.disableProcessComp = false;

            /**
             * Init data
             */
            $q.all([loadDepartment(), loadCompany(), loadWasteItems()]).then(function (result) {
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
                console.log(result);
            }, function (error) {
                Notifications.addError({
                    'status': 'Failed',
                    'message': 'Loading failed: ' + error
                });
            });
            /**
             * Load VoucherDetail
             */
            function loadVoucherDetail(id) {
                var deferred = $q.defer();
                VoucherService.FindByID({
                    VoucherID: id
                }, function (data) {
                    $scope.recod.voucher_id = data.VoucherID;
                    $scope.recod.owner_comp = data.OwnerComp;
                    $scope.recod.process_comp = data.ProcessComp;
                    $scope.recod.voucher_number = data.VoucherNumber; //$scope.recod.voucher_number;
                    $scope.recod.depart_req = data.DepartReq;
                    $scope.recod.depart_process = data.DepartProcess;
                    $scope.recod.internal_phone = data.InternalPhone;
                    $scope.recod.location = data.Location;
                    // $scope.recod.date_out = data.DateOut;
                    $scope.recod.date_out = $filter('date')(data.DateOut, 'yyyy-MM-dd');
                    $scope.recod.date_complete = $filter('date')(data.DateComplete, 'yyyy-MM-dd');
                    $scope.recod.return_reason = data.ReturnReason;
                    $scope.recod.create_time = data.CreateTime;
                    $scope.wasteItems = [];
                    $scope.processcomp_reupdate_wastelist(data.ProcessComp);
                    data.VoucherDetails.forEach(element => {
                        var x = {};
                        var item = full_lsWastItems.filter(x => x.WasteID === element.WasteID);
                        if (item.length > 0) {
                            x.method_name = item[0].MethodDescription;
                            x.waste_name = item[0].WasteDescription;
                            x.Quantity = element.Quantity;
                            x.Weight = element.Weight;
                            x.WasteID = element.WasteID;
                            $scope.wasteItems.push(x);
                        }
                    })
                    console.log(data);
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }

            /**
             * Load Department into Combobox
             * */
            function loadDepartment() {
                var deferred = $q.defer();
                var query = {
                    DepartType: 'Department',
                    lang: lang
                };
                VoucherService.GetDepartment(query, function (data) {
                    $scope.departments = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
                query.DepartType = 'CenterDepartment';
                VoucherService.GetDepartment(query, function (data) {
                    $scope.cdepartments = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })

            }
            function loadCompany() {
                var deferred = $q.defer();
                CompanyService.GetCompany(function (data) {
                    $scope.company = full_lsCompany = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }
            /**
             * Load WasteItems (update entities)
             */
            function loadWasteItems() {
                var deferred = $q.defer();
                var query = {
                    WasteID: '',
                    lang,
                    ProcessComp: ''
                }
                WasteItemService.GetWasteItemLang(query, function (data) {
                    full_lsWastItems = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.resolve(error);
                })
            }

            /**
             * Define All Columns in UI Grid
             */
            var col = [{
                field: 'VoucherID',
                minWidth: 120,
                displayName: $translate.instant('VoucherID'),
                cellTooltip: true,
                visible: true,
                cellTemplate: '<a href="#/waste/Voucher/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'

            },
            {
                field: 'OwnerComp',
                displayName: $translate.instant('OwnerComp'),
                minWidth: 120,
                cellTooltip: true,
                visible: false

            },
            {
                field: 'ProcessComp',
                minWidth: 120,
                displayName: $translate.instant('ProcessComp'),
                cellTooltip: true
            },
            {
                field: 'VoucherNumber',
                minWidth: 155,
                displayName: $translate.instant('VoucherNumber'),
                cellTooltip: true
            },
            {
                field: 'DepartReq',
                minWidth: 100,
                displayName: $translate.instant('DepartReq'),
                cellTooltip: true
            },
            {
                field: 'DepartProcess',
                minWidth: 100,
                displayName: $translate.instant('DepartProcess'),
                cellTooltip: true
            },
            {
                field: 'InternalPhone',
                minWidth: 100,
                displayName: $translate.instant('InternalPhone'),
                cellTooltip: true
            },
            {
                field: 'Location',
                minWidth: 120,
                displayName: $translate.instant('Location'),
                cellTooltip: true
            },
            {
                field: 'SumTotal',
                minWidth: 80,
                displayName: $translate.instant('SumTotal'),
                cellTooltip: true
            },
            {
                field: 'SumQty',
                minWidth: 80,
                displayName: $translate.instant('SumQty'),
                cellTooltip: true
            },
            {
                field: 'UserID',
                minWidth: 100,
                displayName: $translate.instant('CreateBy'),
                cellTooltip: true
            },
            {
                field: 'Status',
                displayName: $translate.instant('Status'),
                minWidth: 80,
                cellTooltip: true
            },
            {
                field: 'CreateTime',
                displayName: $translate.instant('CreateTime'),
                width: 170,
                minWidth: 150,
                cellTooltip: true
            }
            ];
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
                        'tcode': 'M1'
                    }, function (linkres) {
                        if(linkres.IsSuccess){
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

            /**
             *search list function
             */
            function SearchList() {
                var query = {
                    userID: Auth.username,
                    lang: lang
                };
                query.pageIndex = paginationOptions.pageNumber || '';
                query.pageSize = paginationOptions.pageSize || '';
                query.dateFrom = $scope.dateFrom || '';
                query.dateTo = $scope.dateTo || '';
                query.VoucherID = '';
                query.VoucherNumber = $scope.voucher_number || '';
                query.ProcessComp = $scope.process_comp || '';
                query.DepartProcess = $scope.depart_process || '';
                query.InternalPhone = '';
                query.DepartReq = $scope.DepartReq || '';


                query.Status = $scope.s_status || '';
                if ($scope.onlyOwner == true)
                    query.isCheck = 1;
                else query.isCheck = 0;
                return query;
            }

            function deleteById(id) {
                var data = {
                    VoucherID: id
                };
                VoucherService.DeleteByVoucherID(data, function (res) {
                    if (res.Success) {
                        $scope.Search();
                        $('#myModal').modal('hide');
                        $('#messageModal').modal('hide');
                        $('#nextModal').modal('hide');
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('saveError') + res.Message
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
             *Search function for Button Search
             */
            $scope.Search = function () {
                var deferred = $q.defer();
                if (!$scope.checkErr()) {
                    var deferred = $q.defer();
                    var query = SearchList();
                    VoucherService.Search(query, function (res) {
                        $scope.gridOptions.data = res.TableData;
                        $scope.gridOptions.totalItems = res.TableCount[0];
                        //deferred.resolve(data);
                    }, function (error) {
                        deferred.reject(error);
                    })
                }
            }

            var gridMenu = [{
                title: $translate.instant('Create'),
                action: function () {
                    $scope.reset();
                    $scope.recod.owner_comp = 'DBF1EA58-1326-442B-B4C3-897063F4F7FE';
                    $scope.status = 'N';
                    $scope.company = full_lsCompany.filter(x => x.Status == 1);
                    $scope.lsWastItems = [];
                    $("#ProcessComp").prop('disabled', false);
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
                                var querypromise = loadVoucherDetail(resultRows[0].VoucherID);
                                $("#ProcessComp").prop('disabled', true); //disable ProcessComp text
                                $scope.company = full_lsCompany;
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
                            if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].VoucherID)) {
                                deleteById(resultRows[0].VoucherID);
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

            }, {
                title: $translate.instant('PrintReport'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();

                    if (resultRows.length == 1) {
                        var href = '#/waste/Voucher/print/' + resultRows[0].VoucherID;
                        window.open(href);
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('Select_ONE_MSG')
                        });
                    }
                },
                order: 4
            }
            ];
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
            /**
             * Các Hàm để thêm, xóa Waste item trong param table (VoucherDetail)
             * Function to add, delete wasteitem in param table (Voucherdetail)
             */
            $scope.addWasteItem = function () {
                if ($scope.gd != null || $scope.gd != {}) {
                    var data = $scope.wasteItems.filter(x => x.waste_name === $scope.gd.waste_name);

                    if (data.length != 0) {
                        alert($scope.gd.waste_name + ": " + $translate.instant('waste_name_existed'));
                        $scope.gd = {};
                    }
                    else {
                        if ($scope.gd.Quantity < 0 || $scope.gd.Weight <= 0) {
                            alert($scope.gd.waste_name + ": " + $translate.instant('positive_quantity_weight'));
                            $scope.gd.Quantity = null;
                            $scope.gd.Weight = null;
                        }
                        else {
                            $scope.wasteItems.push($scope.gd);
                            $scope.gd = {};
                        }
                    }
                }
            };
            $scope.deleteWasteItem = function (index) {
                $scope.wasteItems.splice(index, 1);

            };
            $scope.clear = function () {
                $scope.recod = {};

                $('#myModal').modal('hide');
            }
            /**
             * Kiểm tra ngày bắt đầu phải < ngày kết thúc
             * Và các check nhỏ khác
             */

            $scope.checkErr = function () {
                var startDate = $scope.dateFrom;
                var endDate = $scope.dateTo;
                $scope.errMessage = '';
                if (new Date(startDate) > new Date(endDate)) {
                    $scope.isError = true;
                    $scope.errMessage = 'End Date should be greater than Start Date';
                    Notifications.addError({
                        'status': 'error',
                        'message': $scope.errMessage
                    });
                    return true;
                }
                return false;
            };
            $scope.processcomp_reupdate_wastelist = function (process_comp) {
                $scope.wasteItems = [];
                var data = full_lsWastItems.filter(x => x.CompID == process_comp && x.Status == 1);
                if (data.length != 0)
                    $scope.lsWastItems = data;
                else $scope.lsWastItems = [];

            };
        }])
})