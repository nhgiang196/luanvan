/**
 * Created by phkhoi on 07-Sep-17.
 */

define(['myapp', 'angular'], function (myapp, angular) {
    myapp.directive('uploadFile', ['OAServices', 'Notifications', function (OAServices, Notifications) {
        return {
            restrict: 'AEC',
            scope: {
                uploadFile: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    //  var files = e.target.files;
                    //  var i,f;
                    var f = element[0].files[0];
                    //   for (i = 0, f = files[i]; i != files.length; ++i) {
                    if (element[0].files[0].type == "application/vnd.ms-excel") {
                        var r = new FileReader();
                        r.onload = function (evet) {
                            var data = evet.target.result;
                            var workbook = XLSX.read(data, {type: 'binary'});
                            var first_sheet_name = workbook.SheetNames[0];
                            /* Get worksheet */
                            var worksheet = workbook.Sheets[first_sheet_name];
                            console.log(XLSX.utils.sheet_to_json(worksheet, {raw: true}));
                            var first_sheet_name = workbook.SheetNames[0];
                            /* Get worksheet */
                            var worksheet = workbook.Sheets[first_sheet_name];
                            var arr = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                            scope.EmployeeHandle = {};
                            scope.EmployeeHandle.empDetail = [];
                            function FromOADate(oadate) {
                                return new Date(((oadate - 25569 ) * 86400000));
                            }

                            for (var i = 0; i < arr.length; i++) {
                                var propery = {};
                                var month = '';
                                var year = new Date().getFullYear();
                                var keys = Object.keys(arr[i]);
                                for (var j = 0; j < keys.length; j++) {
                                    var key = keys[j];
                                    if (key != undefined && key.indexOf('/') == 1) {
                                        month = key.substring(2, 3);
                                        break;
                                    }
                                }
                                if (month.toString().trim() != '') {
                                    for (var k = 1; k < 32; k++) {
                                        var str = k + '/' + month;

                                        if (arr[i][str] != undefined && arr[i][str].toString().trim() != '') {
                                            propery.DateSwipe = month + '/' + k + '/' + year || NaN;
                                            propery.Type = 'AddLunch' || NaN;
                                            propery.EmployeeID_Old = arr[i].ID.toString().trim() || '';
                                            propery.Reason = 'Forget swipe Card at Lunch';
                                            scope.EmployeeHandle.empDetail.push(propery);
                                            propery = {};
                                        }
                                    }
                                } else if (arr[i].EmployeeID_Old != undefined && arr[i].EmployeeID_Old.toString().trim != '') {
                                    var teee = arr[i].EmployeeID_Old.toString().trim().length;
                                    propery.EmployeeID_Old = arr[i].EmployeeID_Old.toString().trim().length == 6 ? arr[i].EmployeeID_Old.toString().trim() : arr[i].EmployeeID_Old.toString().trim().padStart(6, '0');
                                    propery.DateSwipe = moment(FromOADate(arr[i].DateSwipe).toString().trim()) || NaN;
                                    propery.Type = arr[i].Type.toString().trim() || NaN;
                                    propery.Reason = arr[i].Reason.toString().trim();
                                    scope.EmployeeHandle.empDetail.push(propery);
                                    propery = {};
                                }


                            }
                            if(scope.$parent.IsSuccess){
                                OAServices.getInformation.UploadExcel({}, scope.EmployeeHandle).$promise.then(function (res) {
                                    if (res.Mess) {
                                        Notifications.addError({
                                            'status': 'info',
                                            'message': res.Mess
                                        });
                                    } else {
                                        Notifications.addError({
                                            'status': 'error',
                                            'message': res.Error
                                        });
                                    }
                                }, function (errormessage) {
                                    Notifications.addError({
                                        'status': 'error',
                                        'message': errormessage
                                    });
                                });

                            }else{
                                Notifications.addError({
                                    'status': 'error',
                                    'message': 'Can not upload file. Please contact IT department.'
                                });
                            }

                        };
                        r.readAsBinaryString(f);
                    } else {
                        Notifications.addError({
                            'status': 'info',
                            'message': 'you import is not correct with  format！ .xls'
                        });

                    }
                });
            }
        }
    }]);
    myapp.directive('fileReader', function (OAServices) {
        return {
            scope: {
                fileReader: '='
            },
            link: function (scope, element) {
                $(element).on('change', function (changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function (e) {
                            var contents = e.target.result;
                            scope.$apply(function () {

                                scope.fileReader = contents;

                                var lines = contents.split('\n');

                                var result = [];

                                var headers = lines[0].split(',');
                                var UserInfo = '';
                                for (var i = 1; i < lines.length - 1; i++) {
                                    var obj = {};
                                    var LineSplit = lines[i].split(',');

                                    for (var j = 0; j < headers.length; j++) {
                                        obj[headers[j]] = LineSplit[j];
                                    }
                                    if (LineSplit[0] != '') {
                                        UserInfo += LineSplit[0] + ':' + LineSplit[1] + ':' + LineSplit[2] + ':' + LineSplit[3] + '|'
                                    }


                                    result.push(obj);
                                }
                                UserInfo = UserInfo.substring(0, UserInfo.length - 2);
                                console.log(UserInfo);
                                OAServices.getInformation.UploadUserHandle({UserInfo: UserInfo}).$promise.then(function (res) {
                                    console.log('----------------');//

                                    console.log(res);
                                    alert('Add success. Page will reload.');

                                    setTimeout(function () {
                                        location.reload();
                                    }, 3000);
                                }, function (errormessage) {
                                    Notifications.addError({'status': 'error', 'message': errormessage});
                                });

                            });
                        };

                        r.readAsText(files[0]);

                    }
                });
            }
        };
    });
    myapp.controller('MealController', ['$scope', '$filter', '$compile', '$routeParams', '$resource', '$location', 'i18nService', 'Notifications', 'User', 'Forms', 'Auth', 'uiGridConstants', '$http', 'EngineApi', 'ConQuaService', '$upload', '$translatePartialLoader', '$translate', 'OAServices',
        function ($scope, $filter, $compile, $routeParams, $resource, $location, i18nService, Notifications, User, Forms, Auth, uiGridConstants, $http, EngineApi, ConQuaService, $upload, $translatePartialLoader, $translate, OAServices) {

            $scope.dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.sum = 0;
            $scope.flowkey = 'FEPVOAMeal';
            $scope.note = {};
            //  $scope.CDepartmentList = {DepartmentID: "A", Specification: "", Spe: "", Alias: ""};
            $scope.DepartmentID = '';
            $scope.Total = 0;
            $scope.exportExel = {};
            $scope.showall = true;
            var dataongrid = {};


            var file = '';
            $scope.onFileSelect = function ($files) {
                console.log($files);
                file = $files;
            };


            EngineApi.getDepartment().getList({userid: Auth.username, ctype: ''}, function (res) {
                $scope.CDepartmentList = res;
                console.log($scope.CDepartmentList);
            });


            var col = [
                {
                    field: 'DepartmentID',
                    cellTemplate: '<a ng-click="grid.appScope.getVoucher(row,' + '\'\'' + ')"  style="padding:5px;display:block; cursor:pointer">{{COL_FIELD}}</a>',
                    displayName: $translate.instant('Department'),
                    minWidth: 100,
                    cellTooltip: true
                },
                {
                    field: 'Specification',
                    displayName: $translate.instant('Specification'),
                    minWidth: 105,
                    cellTooltip: true
                },
                {
                    field: 'Lunch', displayName: $translate.instant('Lunch'), minWidth: 10, cellTooltip: true,
                    cellTemplate: '<a ng-click="grid.appScope.getVoucher(row,' + '\'L\'' + ')"  style="padding:5px;display:block; cursor:pointer">{{COL_FIELD}}</a>',
                },
                {
                    field: 'Dinner', displayName: $translate.instant('Dinner'), minWidth: 10, cellTooltip: true,
                    cellTemplate: '<a ng-click="grid.appScope.getVoucher(row,' + '\'D\'' + ')"  style="padding:5px;display:block; cursor:pointer">{{COL_FIELD}}</a>',
                },
                {
                    field: 'Night', displayName: $translate.instant('Night'), minWidth: 10, cellTooltip: true,
                    cellTemplate: '<a ng-click="grid.appScope.getVoucher(row,' + '\'N\'' + ')"  style="padding:5px;display:block; cursor:pointer">{{COL_FIELD}}</a>',
                },

                {
                    field: 'Total',
                    displayName: $translate.instant('Total'),
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    minWidth: 10,
                    cellTooltip: true
                }
            ];
            var col1 = [
                {
                    field: 'EmployeeID',
                    // cellTemplate: '<a ng-click="grid.appScope.getVoucher(row)"  style="padding:5px;display:block; cursor:pointer">{{COL_FIELD}}</a>',
                    displayName: $translate.instant('EmployeeID'),
                    minWidth: 120,
                    cellTooltip: true
                },
                {
                    field: 'EmployeeID_Old',
                    displayName: $translate.instant('EmployeeID_Old'),
                    minWidth: 100,
                    cellTooltip: true
                },
                {
                    field: 'Name',
                    displayName: $translate.instant('Specification'),
                    minWidth: 150,
                    cellTooltip: true
                },
                {field: 'Sex', displayName: $translate.instant('Sex'), minWidth: 90, cellTooltip: true},
                {
                    field: 'DepartmentID',
                    displayName: $translate.instant('Department'),
                    minWidth: 105,
                    cellTooltip: true
                },
                {
                    field: 'Specification',
                    displayName: $translate.instant('Specification'),
                    minWidth: 200,
                    cellTooltip: true
                },
                {field: 'DateSwipe', displayName: $translate.instant('DateSwipe'), minWidth: 180, cellTooltip: true},
                {field: 'TimeSwipe', displayName: $translate.instant('TimeSwipe'), minWidth: 180, cellTooltip: true},
                {field: 'Machine', displayName: $translate.instant('Machine'), minWidth: 180, cellTooltip: true},
                {field: 'Type', displayName: $translate.instant('Type'), minWidth: 150, cellTooltip: true}


            ];
            $scope.gridOptions = {
                columnDefs: col,
                data: [],
                enableColumnResizing: true,
                enableSorting: true,
                showGridFooter: true,
                gridFooterTemplate: '<div style=\'text-align: right;padding-right: 165px\'><b>Total: {{grid.appScope.Total}} </b></div>',
                // showColumnFooter: true,
                enableGridMenu: true,
                //   exporterMenuPdf: false,
                enableSelectAll: false,
                enableRowHeaderSelection: true,
                enableRowSelection: true,
                multiSelect: true,
                paginationPageSizes: [50, 100, 200, 500],
                paginationPageSize: 50,
                useExternalPagination: true,
                enablePagination: true,
                enablePaginationControls: true,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    EngineApi.getTcodeLink().get({
                        'userid': Auth.username,
                        'tcode': $scope.flowkey
                    }, function (linkres) {
                        $scope.IsSuccess=linkres.IsSuccess;

                        if (linkres.IsSuccess) {
                            gridApi.core.addToGridMenu(gridApi.grid, gridMenu);

                        }
                    });
                    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                        $scope.selectedVoucherid = row.entity.VoucherID;
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        getPage();
                    });
                }

            };
            var paginationOptions = {
                pageNumber: 1,
                pageSize: 50,
                sort: null
            };

            $scope.gridOptions1 = {
                columnDefs: col1,
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
                paginationPageSizes: [20, 40, 200, 500],
                paginationPageSize: 20,
                exporterOlderExcelCompatibility: true,
                useExternalPagination: true,
                enablePagination: true,
                enablePaginationControls: true


            };
            $scope.Search = function () {
                getPage();
            };

            var getPage = function () {
                $scope.Total = 0;

                var query = {};
                if ($scope.showall == true) {
                    query.IncludeOTUser = 'False';
                }
                else {
                    query.IncludeOTUser = 'True';
                }
                query.UserID = Auth.username;
                query.DepartmentID = $scope.note.Department || '';

                query.DateB = $scope.dateFrom || '';
                query.DateE = $scope.dateTo || '';
                OAServices.getInformation.getInfo(query).$promise.then(function (res) {
                    dataongrid = angular.toJson(res);
                    console.log(res);
                    for (var i = 0; i < res.length; i++) {
                        $scope.Total += parseInt(res[i].Total);
                    }


                    $scope.exportExel = res;
                    $scope.gridOptions.data = res;
                }, function (errormessage) {
                    Notifications.addError({'status': 'error', 'message': errormessage});
                });

            };
            $scope.bpmnloaded = false;
            $scope.showPng = function () {
                if ($scope.bpmnloaded == true) {
                    $scope.bpmnloaded = false;
                } else {
                    $scope.bpmnloaded = true;
                }
            };

            $scope.getVoucher = function (obj, Type) {
                $('#myModal').modal('show');
                var paras = {};
                if ($scope.showall == true) {
                    paras.IncludeOTUser = 'False';
                }
                else {
                    paras.IncludeOTUser = 'True';
                }
                paras.UserID = Auth.username;
                paras.DepartmentID = obj.entity.DepartmentID;
                paras.DateE = $scope.dateTo;
                paras.DateB = $scope.dateFrom;
                paras.Type = Type;

                OAServices.getInformation.getInfoByDepartmentID(paras).$promise.then(function (res) {
                    $scope.gridOptions1.data = res;
                    console.log(res);

                }, function (errormessage) {
                    Notifications.addError({'status': 'error', 'message': errormessage});
                });


            };
            $scope.reset = function () {
                $('#myModal').modal('hide');
            };
            var gridMenu = [{
                title: $translate.instant('Print Report Details'),
                action: function ($event) {

                    $scope.deptID = '';
                    if ($scope.note.Department == undefined) {
                        $scope.deptID = 'All';
                    }
                    else {
                        $scope.deptID = $scope.note.Department;
                    }
                    if ($scope.showall == true) {
                        $scope.IncludeOTUser = 'False';
                    }
                    else {
                        $scope.IncludeOTUser = 'True';
                    }

                    //    return $scope.note.Department;
                    var href = '#/gate/MealDetails/' + $scope.dateFrom + '/' + $scope.dateTo + '/' + $scope.deptID + '/' + $scope.IncludeOTUser;
                    window.open(href);
                },
                order: 1

            }, {
                title: $translate.instant('Export Excel File Details'),
                order: 2,
                action: function ($event) {
                    var paras = {};
                    if ($scope.showall == true) {
                        paras.IncludeOTUser = 'False';
                    }
                    else {
                        paras.IncludeOTUser = 'True';
                    }
                    paras.UserID = Auth.username;
                    paras.DepartmentID = '';
                    paras.DateE = $scope.dateTo;
                    paras.DateB = $scope.dateFrom;
                    paras.Type = '';
                    OAServices.getInformation.getInfoByDepartmentID(paras).$promise.then(function (res) {
                        console.log(res);

                        $scope.exportExel = res;

                        function convertArrayOfObjectsToCSV(args) {
                            var result, ctr, keys, columnDelimiter, lineDelimiter, data;

                            data = args.data || null;
                            if (data == null || !data.length) {
                                return null;
                            }

                            columnDelimiter = args.columnDelimiter || ',';
                            lineDelimiter = args.lineDelimiter || '\n';

                            keys = Object.keys(data[0]);

                            result = '\uFEFF';
                            result += keys.join(columnDelimiter);
                            result += lineDelimiter;

                            data.forEach(function (item) {
                                ctr = 0;
                                keys.forEach(function (key) {
                                    if (ctr > 0) result += columnDelimiter;

                                    result += item[key];
                                    ctr++;
                                });
                                result += lineDelimiter;
                            });

                            return result;
                        }

                        var data, filename, link;

                        var csv = convertArrayOfObjectsToCSV({
                            data: res
                        });
                        if (csv == null) return;

                        filename = 'export.csv';

                        if (!csv.match(/^data:text\/csv/i)) {
                            csv = 'data:text/csv;charset=UTF-16,' + csv;
                        }
                        data = encodeURI(csv);

                        link = document.createElement('a');
                        link.setAttribute('href', data);
                        link.setAttribute('download', filename);
                        link.click();


                    }, function (errormessage) {
                        Notifications.addError({'status': 'error', 'message': errormessage});
                    });
                }
            },
                {
                    title: $translate.instant('Export Excel File By Department'),
                    order: 3,
                    action: function () {
                        var objects = dataongrid;
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
                                    obj[prop] = +obj[prop];
                                }
                            }
                        }
                        //       console.log(objects);
                        JSONToCSVConvertor(objects, 'Meal_Report', true);
                    }
                }
            ];

            function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '\uFEFF';
                CSV += ReportTitle + '\r\n\n';
                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var row = '';
                    //This loop will extract the label from 1st index of on array
                    for (var index in arrData[0]) {
                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }
                    row = row.slice(0, -1);
                    //append Label row with line break
                    CSV += row + '\r\n';
                }
                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = '';
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }
                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert('Invalid data');
                    return;
                }

                //Generate a file name
                var fileName = '';
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g, '_');

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-16,' + encodeURI(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension

                //this trick will generate a temp <a /> tag
                var link = document.createElement('a');
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = 'visibility:hidden';
                link.download = fileName + '.csv';

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            $scope.setDate = function () {
                // var startDate1 = $scope.dateFrom;
                $scope.dateTo = $filter('date')(new Date($scope.dateFrom), 'yyyy-MM-dd');
                $scope.$apply();

            };


        }])
    ;
})
;
