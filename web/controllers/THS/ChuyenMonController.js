define([
    "myapp",// "controllers/EHS/Waste/Directive/ChuyenMonDirective",
    "angular"], function (myapp, angular) {
        myapp.controller("ChuyenMonController", ["$filter", "Notifications", "Auth", "EngineApi", "THSAdminService", "$translate", "$q", "$scope",
            function ($filter, Notifications, Auth, EngineApi, THSAdminService, $translate, $q, $scope) {
                $scope.flowkey = 'ANK';
                $scope.username = Auth.username;
                formVariables = $scope.formVariables = [];
                historyVariable = $scope.historyVariable = [];
                var lang = window.localStorage.lang;
                $scope.recod = {};
                $scope.isError = false;
                $scope.status = "";
                // var paginationOptions = {
                //   pageNumber: 1,
                //   pageSize: 50,
                //   totalItems: 0,
                //   sort: null
                // };
                $scope.StatusList = [
                    {
                        id: "1",
                        name: $translate.instant("Status1")
                    },
                    {
                        id: "0",
                        name: $translate.instant("Status0")
                    },
                    {
                        id: "X",
                        name: $translate.instant("StatusX")
                    }
                ];
                /**
                * Define All Columns in UI Grid
                */
                var col = [
                    {
                        field: "nk",
                        minWidth: 120,
                        displayName: $translate.instant("nk"),
                        cellTooltip: true,
                        visible: true,
                        // cellTemplate:
                        //   '<a href="#/waste/ChuyenMon/print/{{COL_FIELD}}" style="padding:5px;display:block; cursor:pointer" target="_blank">{{COL_FIELD}}</a>'
                    },
                    {
                        field: "nkten",
                        displayName: $translate.instant("nkten"),
                        minWidth: 100,
                        cellTooltip: true,
                        visible: true
                    },
                    {
                        field: "nknam",
                        displayName: $translate.instant("nknam"),
                        minWidth: 150,
                        cellTooltip: true,
                        visible: true
                    },
                    {
                        field: "nktungay",
                        displayName: $translate.instant("nktungay"),
                        minWidth: 100,
                        cellTooltip: true,
                        visible: true
                    },
                    {
                        field: "nkdenngay",
                        displayName: $translate.instant("nkdenngay"),
                        minWidth: 100,
                        cellTooltip: true,
                        visible: true
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
                // $scope.getDate = function (date) {
                //   if (date != '')
                //     return $filter('date')(date, 'yyyy-MM-dd hh:mm');
                //   else {
                //     return date;
                //   }
                // };
                /**
                * Query Grid setting
                */
                function LoadDetails(entity) {
                    $scope.recod.nk = entity.nk;
                    $scope.recod.nkten = entity.nkten;
                    $scope.recod.nknam = entity.nknam;
                    $scope.recod.nktungay = entity.nktungay;
                    $scope.recod.nkdenngay = entity.nkdenngay;
                }
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
                        EngineApi.getTcodeLink().get(
                            {
                                userid: Auth.username,
                                tcode: $scope.flowkey
                            },
                            function (linkres) {
                                if (linkres.IsSuccess) {
                                    gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
                                }
                            }
                        );
                        ///gridApi.core.addToGridMenu(gridApi.grid, gridMenu);
                        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                            $scope.selectedSupID = row.entity.SupID;
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (
                            newPage,
                            pageSize
                        ) {
                            paginationOptions.pageNumber = newPage;
                            paginationOptions.pageSize = pageSize;
                            $scope.Search();
                        });
                    }
                };
                var gridMenu = [
                    {
                        title: $translate.instant("Create"),
                        action: function () {
                            $scope.reset();
                            $scope.status = "N";
                            $('#key').prop('disabled', false);
                            $("#myModal").modal("show");
                        },
                        order: 1
                    },
                    {
                        title: $translate.instant("Update"),
                        action: function () {
                            var resultRows = $scope.gridApi.selection.getSelectedRows();
                            $scope.status = "M"; //Set update Status    
                            if (resultRows.length == 1) {
                                if (resultRows[0].status != "X") {
                                    // if (resultRows[0].UserID == Auth.username) {
                                    var entity = resultRows[0];
                                    LoadDetails(entity);
                                    $('#key').prop('disabled', true);
                                    $("#myModal").modal("show");
                                    // } else {
                                    //     Notifications.addError({
                                    //         status: "error",
                                    //         message: $translate.instant("ModifyNotBelongUserID")
                                    //     });
                                    // }
                                } else {
                                    Notifications.addError({
                                        status: "error",
                                        message: $translate.instant("Modified_to_X")
                                    });
                                }
                            } else {
                                Notifications.addError({
                                    status: "error",
                                    message: $translate.instant("Select_ONE_MSG")
                                });
                            }
                        },
                        order: 2
                    },
                    {
                        title: $translate.instant("OnOff"),
                        action: function () {
                            var resultRows = $scope.gridApi.selection.getSelectedRows();
                            if (resultRows.length == 1) {
                                if (resultRows[0].status != "X") {
                                    changestatusbyId(resultRows[0].bm);
                                } else {
                                    Notifications.addError({
                                        status: "error",
                                        message: $translate.instant("Modified_to_X")
                                    });
                                }
                            } else {
                                Notifications.addError({
                                    status: "error",
                                    message: $translate.instant("Select_ONE_MSG")
                                });
                            }

                        },
                        order: 3
                    },
                    {
                        title: $translate.instant("Delete"),
                        action: function () {
                            var resultRows = $scope.gridApi.selection.getSelectedRows();
                            // if (resultRows[0].UserID == Auth.username) {
                            if (resultRows.length == 1) {
                                if (confirm($translate.instant("Delete_IS_MSG") + ":" + resultRows[0].bm)) {
                                    deleteById(resultRows[0].bm);
                                }
                            } else {
                                Notifications.addError({
                                    status: "error",
                                    message: $translate.instant("Select_ONE_MSG")
                                });
                            }
                        },
                        order: 4
                    }
                    // , {
                    //     title: $translate.instant('PrintReport'),
                    //     action: function () {
                    //         var resultRows = $scope.gridApi.selection.getSelectedRows();
                    //         if (resultRows.length == 1) {
                    //             var href = '#/waste/ChuyenMon/print/' + resultRows[0].BM;
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
                // /**
                // *search list function
                // */
                // function SearchList() {
                //   var query = {
                //     userID: Auth.username,
                //     lang: lang
                //   };
                //   query.pageIndex = paginationOptions.pageNumber ||r "";
                //   query.pageSize = paginationOptions.pageSize || "";
                //   return query;
                // }
                /**
                *Search function for Button Search
                */
                $scope.Search = function () {
                    // var query = SearchList();
                    var query = {};
                    query.table = "ChuyenMon";
                    THSAdminService.GetAll(
                        query,
                        function (res) {
                            $scope.gridOptions.data = res;
                        },
                        function (error) {
                            Notifications.addError({
                                'status': 'error',
                                'message': $translate.instant('SearchError') + error.Message
                            });
                        }
                    );
                };
                function changestatusbyId(id) {
                    THSAdminService.cudChuyenMon({ action: 'changestatus', bm: id, ten: '' }, function (res) {
                        if (res.Success)
                            Notifications.addError({
                                status: "infor",
                                message: $translate.instant("Change Status Success")
                            });
                    }, function (error) {
                        Notifications.addError({
                            status: "error",
                            message: $translate.instant("Change status Fail")
                        });
                    });
                }
                function deleteById(id) {
                    var data = {
                        action: 'remove',
                        bm: id,
                        ten: '',
                    };
                    THSAdminService.cudChuyenMon(data, function (res) {
                        if (res.Success) {
                            $scope.Search();
                            $("#myModal").modal("hide");
                            Notifications.addError({
                                status: "infor",
                                message: $translate.instant("Delete Success") + res.Data
                            });
                        } else {
                            Notifications.addError({
                                status: "error",
                                message: $translate.instant("saveError") + res.Message
                            });
                        }
                    },
                        function (error) {
                            Notifications.addError({
                                status: "error",
                                message: $translate.instant("saveError") + error
                            });
                        }
                    );
                }

                $scope.clear = function () {
                    $scope.recod = {};
                    $("#myModal").modal("hide");
                };
                //DIRECTIVE
                /**
                 * Init Data to save
                 */
                function saveInitData() {
                    var note = {};
                    note.nk = $scope.recod.nk;
                    note.nkten = $scope.recod.nkten || '';
                    note.nknam = $scope.recod.nknam || '';
                    note.nktungay = $scope.recod.nktungay || '';
                    note.nkdenngay = $scope.recod.nkdenngay || '';
                    if ($scope.status == 'M')
                        note.action = 'update';
                    else note.action = 'create';
                    return note;
                }
                /**
                 * Save
                 */
                function Create(data) {
                    THSAdminService.cudChuyenMon(data, function (res) {
                        console.log(res)
                        if (res.Success) {
                            $scope.Search();
                            $('#myModal').modal('hide');
                            $('#messageModal').modal('hide');
                            $('#nextModal').modal('hide');
                        }
                        else {
                            Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + res.Message });
                        }
                    }, function (error) {
                        Notifications.addError({ 'status': 'error', 'message': $translate.instant('saveError') + error });
                    })
                }
                /**
                 * Update status by updateByID
                 */
                function updateByID(data) {
                    THSAdminService.cudChuyenMon(data, function (res) {
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
                 *Reset data function
                 */
                $scope.reset = function () {
                    $scope.recod = {};
                    $('#myModal').modal('hide');
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
        ]);
    });
