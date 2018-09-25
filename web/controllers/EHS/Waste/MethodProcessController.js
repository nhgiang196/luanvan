define(['myapp', 'controllers/EHS/Waste/Directive/MethodProcessDirective', 'angular'], function (myapp, angular) {
    myapp.controller('MethodProcessController', ['$filter', 'Notifications', 'Auth', 'EngineApi', 'MethodProcessService', '$translate', '$timeout', '$q', '$scope',
        function ($filter, Notifications, Auth, EngineApi, MethodProcessService, $translate, $timeout, $q, $scope) {
            var lang = window.localStorage.lang;
            $scope.recod = {};
            $scope.flowkey = 'WC01';
            $scope.onlyOwner = true;
            $scope.isError = false;
            $scope.recod.ExpectOutTime;
            $scope.status = '';
            // set initial selected option to blood type B
            $scope.selectedOption = {
                'description': 'B'
            };
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                sort: null
            };
            /**
             * Load detail when modifying
             * @param {MethodID} id 
             */
            function loadMethodDetail(id) {
                var deferred = $q.defer();
                MethodProcessService.FindByID({
                    MethodID: id
                }, function (data) {
                    $scope.recod.method_id = data.MethodID;
                    $scope.recod.method_name = data.MethodName;
                    $scope.recod.description_EN = data.Description_EN;
                    $scope.recod.description_TW = data.Description_TW;
                    $scope.recod.description_CN = data.Description_CN;
                    $scope.recod.description_VN = data.Description_VN;
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
                field: 'MethodID',
                minWidth: 30,
                displayName: $translate.instant('MethodID'),
                cellTooltip: true,
                visible: false
            },
            {
                field: 'MethodName',
                displayName: $translate.instant('MethodName'),
                minWidth: 100,
                cellTooltip: true
            },
            {
                field: 'Description_VN',
                displayName: $translate.instant('MethodDescriptionVN'),
                minWidth: 10,
                cellTooltip: true
            },
            {
                field: 'Description_TW',
                minWidth: 100,
                displayName: $translate.instant('MethodDescriptionTW'),
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
            $scope.statuslist = [{
                id: '1',
                name: $translate.instant('Available')
            },
            {
                id: '0',
                name: $translate.instant('Unavailable')
            },
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
                        SearchList();
                    });
                }
            };
            /**
             *Reset data function
             */
            $scope.reset = function () {
                $scope.recod = {};
                $('#myModal').modal('hide');
            }
            /**
             *Search list function
             */
            function SearchList() {
                var query = {
                    userID: ''
                };
                query.PageIndex = paginationOptions.pageNumber || '';
                query.PageSize = paginationOptions.pageSize || '';
                query.MethodName = $scope.method_name || '';
                query.Description = $scope.method_description || '';
                query.Status = $scope.w_status || '';
                return query;
            }
            /** OFF/ON the status of method process */
            function deleteById(id) {
                var data = { MethodID: id };
                MethodProcessService.DeleteByMethodID(data, function (res) {
                    if (res.Success) {
                        $timeout(function () { $scope.Search() }, 1000);
                        Notifications.addMessage({ 'status': 'information', 'message': $translate.instant('Delete_Success_MSG') });
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
                var query = SearchList();
                MethodProcessService.Search(query, function (data) {
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
                    $scope.status = 'M';//Set update Status
                    if (resultRows.length == 1) {
                        // if (resultRows[0].Status == 'N' && resultRows[0].UserID == Auth.username) {
                        var querypromise = loadMethodDetail(resultRows[0].MethodID);
                        $scope.create_time = resultRows[0].CreateTime;
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
                    if (resultRows.length == 1) {
                        if (confirm($translate.instant('Delete_IS_MSG') + ':' + resultRows[0].MethodName)) {
                            var updatepromise = deleteById(resultRows[0].MethodID);
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
