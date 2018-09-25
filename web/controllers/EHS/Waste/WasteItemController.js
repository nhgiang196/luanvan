

define(['myapp', 'controllers/EHS/Waste/Directive/WasteItemDirective', 'angular'], function (myapp, angular) {
    myapp.controller('WasteItemController', ['$filter', '$http',
        '$routeParams', '$resource', '$location', '$interval', '$timeout',
        'Notifications', 'Forms', 'Auth', 'uiGridConstants', 'EngineApi', 'WasteItemService', 'MethodProcessService', '$translate', '$q', '$scope', 'CompanyService',
        function ($filter, $http, $routeParams,
            $resource, $location, $interval, $timeout, Notifications, Forms, Auth, uiGridConstants,
            EngineApi, WasteItemService, MethodProcessService, $translate, $q, $scope, CompanyService) {

            var lang = window.localStorage.lang; //language
            $scope.recod = {}; //data in modal
            $scope.note = {};
            var historyurl = '';
            $scope.flowkey = 'HW01';
            $scope.isError = false;
            $scope.method_list = []; //cbx
            $scope.companylist = []; //cbx
            $scope.status = ''; //form status
            
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                sort: null
            };
            /**Define list of waste item state and status */
            $scope.statelist = [{
                id: 'S',
                name: $translate.instant('Solid')
            },
            {
                id: 'L',
                name: $translate.instant('Liquid')
            },
            {
                id: 'M',
                name: $translate.instant('Sludge')
            }
            ];
            $scope.statuslist = [{
                id: '1',
                name: $translate.instant('Available')
            },
            {
                id: '0',
                name: $translate.instant('Unavailable')
            },
            ];

            $q.all([loadMethodName(), loadCompany()]);
            /**
             * Load Method combobox
             */

            function loadMethodName() {
                var query = { lang: lang };
                MethodProcessService.GetMethod(query, function (data) {
                    console.log(data);
                    $scope.method_list = data;
                }, function (errormessage) {
                    Notifications.addError({
                        'status': 'error',
                        'message': errormessage
                    });
                });
            }
            /**Load company combobox */
            function loadCompany() {
                var query = { lang: lang };
                CompanyService.GetCompany(function (data) {
                    console.log(data);
                    $scope.companylist = data;
                }, function (error) {
                    Notifications.addError({
                        'status': 'error',
                        'message': errormessage
                    });
                })
            }
            /**
             * load WasteItem details by WasteID
             * Hàm load chi tiết và đưa binding vào modal
             */
            function loadWasteItemDetails(WasteID) {
                var deferred = $q.defer();
                WasteItemService.FindByID({
                    WasteID: WasteID
                }, function (data) {
                    $scope.recod.waste_id = data.WasteID;
                    $scope.recod.item_code = data.ItemCode;
                    $scope.recod.state = data.State;
                    $scope.recod.description_TW = data.Description_TW;
                    $scope.recod.description_VN = data.Description_VN;
                    $scope.recod.method_id = data.MethodID;
                    $scope.recod.compid = data.CompID;
                    $scope.recod.status = data.Status;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }
            var col = [
                {
                    field: 'WasteID',
                    minWidth: 50,
                    displayName: $translate.instant('WasteID'),
                    cellTooltip: true,
                    visible: false,
                    // cellTemplate: '<span  >{{grid.appScope.getVoucherStatus(row.entity.Status)}}</span>'
                },
                {
                    field: 'ItemCode',
                    displayName: $translate.instant('ItemCode'),
                    width: 100,
                    minWidth: 20,
                    cellTooltip: true,

                },
                {
                    field: 'Description_VN',
                    displayName: $translate.instant('WasteItemDescriptionVN'),
                    minWidth: 150,
                    cellTooltip: true
                },
                {
                    field: 'Description_TW',
                    minWidth: 100,
                    displayName: $translate.instant('WasteItemDescriptionTW'),
                    cellTooltip: true
                },

                {
                    field: 'CompName',
                    displayName: $translate.instant('ProcessComp'),
                    width: 150,
                    minWidth: 10,
                    cellTooltip: true
                },
                {
                    field: 'MethodName',
                    displayName: $translate.instant('MethodName'),
                    width: 150,
                    minWidth: 100,
                    cellTooltip: true,

                },
                {
                    field: 'State',
                    displayName: $translate.instant('State'),
                    width: 100,
                    minWidth: 10,
                    cellTooltip: true,
                    cellTemplate: '<span>&nbsp{{grid.appScope.getItemState(row.entity.State)}}</span>'
                },
                {
                    field: 'Status',
                    displayName: $translate.instant('Status'),
                    width: 100,
                    minWidth: 10,
                    cellTooltip: true,
                    cellTemplate: '<span>&nbsp{{grid.appScope.getItemStatus(row.entity.Status)}}</span>'
                }



            ];

            $scope.getItemState = function (id) {
                var statLen = $filter('filter')($scope.statelist, { 'id': id });
                if (statLen.length > 0) {
                    return statLen[0].name;
                } else {
                    return id;
                }
            };
            $scope.getItemStatus = function (id) {
                var statLen = $filter('filter')($scope.statuslist, { 'id': id });
                if (statLen.length > 0) {
                    return statLen[0].name;
                } else {
                    return id;
                }
            };
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
                paginationPageSizes: [100, 500, 1000],
                paginationPageSize: 100,
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
                        //gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
                    });
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.selectedSupID = row.entity.SupID;
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        SearchList(); //search list co thể tìm kiếm bằng js, trên tập dữ liệu đã lấy về
                    });
                }
            };
            /**
             *reset data function
             */
            $scope.reset = function () {
                $scope.recod = {};

                $('#myModal').modal('hide');
            }

            /**
             *search list function
             */
            function SearchList() {

                var query = { userID: '', des: '' }
                query.PageIndex = paginationOptions.pageNumber || '';
                query.PageSize = paginationOptions.pageSize || '';
                query.MethodID = $scope.method_id || '';
                query.State = $scope.state || '';
                query.ItemCode = $scope.item_code || '';
                query.Description = $scope.description || '';
                query.ProcessComp = $scope.process_comp || '';
                query.State = $scope.state || '';
                query.Status = $scope.w_status || '';
                return query;
            }


            /**Off/on the status of wasteitem */
            function deleteById(id) {
                var data = { WasteID: id };
                WasteItemService.DeleteByWasteItemID(data, function (res) {
                    if (res.Success) {
                        Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Delete_Success_MSG') });
                        $timeout(function () { $scope.Search() }, 1000);
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
             *Search function
             */
            $scope.Search = function () {
                var deferred = $q.defer();
                var query = SearchList();
                WasteItemService.Search(query, function (data) {
                    $scope.gridOptions.data = data;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
            }
            var gridMenu = [{
                title: $translate.instant('Create'),
                action: function () {
                    $scope.reset();
                    $scope.status = 'N';
                    $("#ProcessComp").prop('disabled', false); //enable ProcessComp text
                    $('#myModal').modal('show');
                },
                order: 1
            }, {
                title: $translate.instant('Update'),
                action: function () {
                    var resultRows = $scope.gridApi.selection.getSelectedRows();
                    $scope.status = 'M';
                    if (resultRows.length == 1) {
                        // if (resultRows[0].Status == 'N' && resultRows[0].UserID == Auth.username) {
                        var querypromise = loadWasteItemDetails(resultRows[0].WasteID);
                        querypromise.then(function () {
                            $("#ProcessComp").prop('disabled', true); //disable ProcessComp text
                            $('#myModal').modal('show');
                        }, function (error) {

                            Notifications.addError({
                                'status': 'error',
                                'message': error
                            });
                        })
                        // }
                        // else {
                        //     Notifications.addError({'status': 'error', 'message': $translate.instant('Edit_Draf_MSG')})
                        // }
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
                    if (resultRows.length == 1) {
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].ItemCode)) {
                            var updatepromise = deleteById(resultRows[0].WasteID);
                        }
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('Select_ONE_MSG')
                        });
                    }
                },
                order: 3

            }];
        }])
})

