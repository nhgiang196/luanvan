define(['myapp', 'controllers/EHS/Waste/Directive/CompanyDirective', 'angular'], function (myapp, angular) {
    myapp.controller('CompanyController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'CompanyService', '$timeout', '$translate', '$q', '$scope',
        function ($filter, Notifications, Auth, EngineApi, CompanyService, $timeout, $translate, $q, $scope) {
            var lang = window.localStorage.lang;
            $scope.recod = {};
            $scope.flowkey = 'HW01';
            $scope.onlyOwner = true;
            $scope.isError = false;
            $scope.recod.ExpectOutTime;
            $scope.status = '';
            //Create Company List Types
            $scope.types = [{ id: 'O', name: $translate.instant('OwnerComp') }, { id: 'P', name: $translate.instant('ProcessComp') }];
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                sort: null
            };
            $scope.statuslist = [{
                id: '1',
                name: $translate.instant('Available')
            },
            {
                id: '0',
                name: $translate.instant('Unavailable')
            },
            ];
            /**
             * Load company detail when modifying
             * @param {CompID} id 
             */
            function loadCompanyDetail(id) {
                var deferred = $q.defer();
                CompanyService.FindByID({
                    CompID: id
                }, function (data) {
                    $scope.recod.comp_id = data.CompID;
                    $scope.recod.comp_name = data.CompName;
                    $scope.recod.comp_code = data.CompCode;
                    $scope.recod.type = data.Type;
                    $scope.recod.email = data.Email;
                    $scope.recod.phone = data.Phone;
                    $scope.recod.address = data.Address;
                    $scope.recod.status = data.Status;
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                })
                return deferred.promise;
            }
            /**
             * Define All Columns in UI Grid
             */
            var col = [{
                field: 'CompID',
                minWidth: 30,
                displayName: $translate.instant('CompID'),
                cellTooltip: true,
                visible: false

            },
            {
                field: 'CompName',
                displayName: $translate.instant('CompanyName'),
                minWidth: 100,
                cellTooltip: true,
                //cellTemplate: '<a href="#/gate/Visitor/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
            },
            {
                field: 'CompCode',
                minWidth: 70,
                displayName: $translate.instant('CompanyCode'),
                cellTooltip: true
            },
            {
                field: 'Type',
                displayName: $translate.instant('CompanyType'),
                minWidth: 20,
                cellTooltip: true,
                cellTemplate: '<span  >{{grid.appScope.getCompanyType(row.entity.Type)}}</span>'
                // cellTemplate: '<div ng-if="{{row.Type}} == "O"">Owner</div><div ng-if="{{row.Type}} == "O"">Processor</div>'
            },
            {
                field: 'Phone',
                minWidth: 50,
                displayName: $translate.instant('Phone'),
                cellTooltip: true
            },
            {
                field: 'Email',
                minWidth: 70,
                displayName: $translate.instant('Email'),
                cellTooltip: true
            },
            {
                field: 'Address',
                minWidth: 100,
                displayName: $translate.instant('Address'),
                cellTooltip: true
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
                paginationPageSizes: [50, 100, 200, 500],
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
                    });
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.selectedSupID = row.entity.SupID;
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        $scope.search();
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
            $scope.getCompanyType = function (id) {
                var statLen = $filter('filter')($scope.types, { 'id': id });
                if (statLen.length > 0) {
                    return statLen[0].name;
                } else {
                    return id;
                }
            };

            /**
             *search list function
             */
            function SearchList() {
                var query = {
                    userID: ''
                };
                query.PageIndex = paginationOptions.pageNumber || '';
                query.PageSize = paginationOptions.pageSize || '';
                query.CompName = $scope.comp_name || '';
                query.Type = $scope.type || '';
                query.CompCode = $scope.comp_code || '';
                query.Status = $scope.w_status || '';
                return query;
            }
            function deleteById(id) {
                var data = { CompID: id };
                CompanyService.DeleteByCompanyID(data, function (res) {
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
             *Search function for Button Search
             */
            $scope.Search = function () {
                var deferred = $q.defer();
                var query = SearchList();
                CompanyService.Search(query, function (data) {
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
                        // if (resultRows[0].Status == 'N' && resultRows[0].UserID == Auth.username) {
                        var querypromise = loadCompanyDetail(resultRows[0].CompID);
                        querypromise.then(function () {
                            $('#myModal').modal('show');
                        }, function (error) {

                            Notifications.addError({
                                'status': 'error',
                                'message': error
                            });
                        })
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
                    if (resultRows.length == 1 && resultRows[0].CompID!='DBF1EA58-1326-442B-B4C3-897063F4F7FE') {
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].CompName)) {
                            deleteById(resultRows[0].CompID);
                        }
                    } else {
                        Notifications.addError({
                            'status': 'error',
                            'message': $translate.instant('Select_ONE_MSG')
                        });
                    }
                },
                order: 3

            }
            ];

        }
    ])
})
