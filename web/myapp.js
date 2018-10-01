/**
 * Created by wangyanyan on 14-3-3.
 */

define(['angularAMD', 'app', 'services/main', 'directive/main'], function (angularAMD, app) {
    app.config(['$routeProvider', '$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', function ($routeProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

        ////拦截器
        $httpProvider.responseInterceptors.push('interceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            $('#spinner_wait').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
        var lang = window.localStorage.lang || 'EN';
        /*    $translateProvider.useStaticFilesLoader({
         prefix: 'i18n/Basic/',
         suffix: '.json'
         });*/

        $translatePartialLoaderProvider.addPart('Basic');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/i18n/{part}/{lang}.json'
        });

        $translateProvider.preferredLanguage(lang);
        $translateProvider.fallbackLanguage(lang);


        $routeProvider

            .when('/', {
                redirectTo: '/taskForm/main'
            })
            .when('/LIMS/Entrusted/', angularAMD.route({
                templateUrl: "forms/FEPVLims/SingleDraft.html",
                controller: 'EntrustedController',
                controllerUrl: 'controllers/LIMS/EntrustedController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/Ontest', angularAMD.route({
                templateUrl: "forms/FEPVLims/OnTest.html",
                controller: 'OnTestController',
                controllerUrl: 'controllers/LIMS/OnTestController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))

            .when('/Lims/QueryPlans', angularAMD.route({
                templateUrl: "forms/FEPVLims/QueryPlans.html",
                controller: 'QueryPlansController',
                controllerUrl: 'controllers/LIMS/QueryPlansController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/POLY21', angularAMD.route({
                templateUrl: "forms/FEPVLims/POLY21Query.html",
                controller: 'POLY21Controller',
                controllerUrl: 'controllers/LIMS/POLY21Controller',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/POLY21Report/:from/:to/:material/:interval/:month', angularAMD.route({
                templateUrl: "forms/FEPVLims/POLY21Report.html",
                controller: 'POLY21ReportController',
                controllerUrl: 'controllers/LIMS/POLY21ReportController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/SSPDay', angularAMD.route({
                templateUrl: "forms/FEPVLims/SSPDayQuery.html",
                controller: 'SSPDayController',
                controllerUrl: 'controllers/LIMS/SSPDayController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/SSPDayReport/:from/:to/:material/:line/:interval/:month', angularAMD.route({
                templateUrl: "forms/FEPVLims/SSPDayReport.html",
                controller: 'SSPDayReportController',
                controllerUrl: 'controllers/LIMS/SSPDayReportController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/QueryPlans', angularAMD.route({
                templateUrl: "forms/FEPVLims/QueryPlans.html",
                controller: 'QueryPlansController',
                controllerUrl: 'controllers/LIMS/QueryPlansController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/QueryReceive', angularAMD.route({
                templateUrl: "forms/FEPVLims/ReceiveQuery.html",
                controller: 'QueryReceiveController',
                controllerUrl: 'controllers/LIMS/QueryReceiveController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))

            .when('/Lims/QueryCurrentGrade', angularAMD.route({
                templateUrl: "forms/FEPVLims/QueryCurrentGrade.html",
                controller: 'CurrentGradeController',
                controllerUrl: 'controllers/LIMS/CurrentGradeController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/GradeSpecVersion', angularAMD.route({
                templateUrl: 'forms/QCGrades/CreateGrade.html',
                controller: 'GradeController',
                controllerUrl: 'controllers/LIMS/GradeController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            })).when('/Lims/ShowHistory', angularAMD.route({
                templateUrl: 'forms/FEPVLims/showHistoryGradesVersion.html',
                controller: 'showHistoryController',
                controllerUrl: 'controllers/LIMS/showHistoryController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Lims/QueryCurrentGrade', angularAMD.route({
                templateUrl: 'forms/FEPVLims/QueryCurrentGrade.html',
                controller: 'CurrentGradeController',
                controllerUrl: 'controllers/LIMS/CurrentGradeController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ContractorQua/import', angularAMD.route({
                templateUrl: "forms/ContractorQua/import.html",
                controller: 'ContractorImportController',
                controllerUrl: 'controllers/EHS/ContractorImportController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))



            .when('/ConQua/Index', angularAMD.route({  //承揽商资质查询
                templateUrl: "forms/ConQua/Index.html",
                controller: 'ConQuaController',
                controllerUrl: 'controllers/EHS/ConQuaController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Contractor/Detail', angularAMD.route({ // 承揽商资质明细
                templateUrl: "forms/ConQua/detailview.html",
                controller: 'ConQuaDetailController',
                controllerUrl: 'controllers/EHS/ConQuaDetailController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Contractor', angularAMD.route({ // 承揽商资质新建
                templateUrl: "forms/ConQua/startnew.html",
                controller: 'ContractorController',
                controllerUrl: 'controllers/EHS/ContractorController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ContractorQua/Index', angularAMD.route({
                templateUrl: "forms/ContractorQua/Index.html",
                controller: 'ContractorQuaController',
                controllerUrl: 'controllers/EHS/ContractorQuaController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ContractorQua', angularAMD.route({
                templateUrl: "forms/ContractorQua/startnew.html",
                controller: 'ContractorQuaUpdateController',
                controllerUrl: 'controllers/EHS/ContractorQuaUpdateController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ContractorQuaDetail', angularAMD.route({
                templateUrl: "forms/ContractorQua/detail.html",
                controller: 'ContractorQuaDetailController',
                controllerUrl: 'controllers/EHS/ContractorQuaDetailController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/Contractor/StatisticReport', angularAMD.route({
                templateUrl: "forms/ConQua/Statistic.html",
                controller: 'ContractorStatisticController',
                controllerUrl: 'controllers/EHS/ContractorStatisticController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            //目前没用到
            .when('/Contractor/Report', angularAMD.route({
                templateUrl: "forms/ConQua/Report.html",
                controller: 'ContractorReportController',
                controllerUrl: 'controllers/EHS/ContractorReportController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))


            .when('/taskForm/startList', angularAMD.route({
                templateUrl: "views/startList.html",
                controller: 'startListController',
                controllerUrl: 'controllers/startListController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/main', angularAMD.route({
                templateUrl: "views/main.html",
                controller: 'mainController',
                controllerUrl: 'controllers/mainController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/start/:id', angularAMD.route({
                templateUrl: "views/load.html",
                controller: 'startController',
                controllerUrl: 'controllers/startController',
                caseInsensitiveMatch: true,
                resolve: {

                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/processlog/:id/:cId?', angularAMD.route({
                templateUrl: "views/processLog.html",
                controller: 'processlogController',
                controllerUrl: 'controllers/processlogController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/:processDefinitionId/complete/:pid', angularAMD.route({
                templateUrl: 'views/taskCompleted.html',
                controller: 'startFinishedController',
                controllerUrl: 'controllers/startFinishedController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/todo', angularAMD.route({
                templateUrl: "views/todo.html",
                controller: 'todoController',
                controllerUrl: 'controllers/todoController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/task/:taskid/:pid', angularAMD.route({
                templateUrl: "views/load.html",
                controller: 'doTaskController',
                controllerUrl: 'controllers/doTaskController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/:taskid/complete/:pid', angularAMD.route({
                templateUrl: 'views/taskCompleted.html',
                controller: 'taskFinishedController',
                controllerUrl: 'controllers/taskFinishedController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/TaskManage', angularAMD.route({
                templateUrl: 'views/TaskManage.html',
                controller: 'TaskManageController',
                controllerUrl: 'controllers/TaskManageController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/RepositoryManage', angularAMD.route({
                templateUrl: 'views/RepositoryManage.html',
                controller: 'RepositoryController',
                controllerUrl: 'controllers/RepositoryController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/taskForm/DictionaryManage', angularAMD.route({
                templateUrl: 'views/DictionaryManage.html',
                controller: 'DictionaryController',
                controllerUrl: 'controllers/DictionaryController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/main/userInfo', angularAMD.route({
                templateUrl: "views/pages/userInfo.html",
                controller: 'UserInfoController',
                controllerUrl: 'controllers/mainController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))

            .when('/png/:processDefinitionId/:pid', angularAMD.route({
                templateUrl: 'views/pages/png.html',
                controller: 'PngController',
                controllerUrl: 'controllers/historyController',
                caseInsensitiveMatch: true
            }))
            .when('/login', angularAMD.route({
                templateUrl: 'views/login.html',
                controller: 'loginController',
                controllerUrl: 'controllers/loginController'

            }))
            .when('/logout', angularAMD.route({
                templateUrl: 'views/login.html',
                controller: 'logoutController',
                controllerUrl: 'controllers/loginController'
            }))
            .when('/FormSetting/formmain', angularAMD.route({
                templateUrl: "views/formMaintain.html",
                controller: 'formMaintainController',
                controllerUrl: 'controllers/formMaintainControl',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))

            .when('/waste/Main', angularAMD.route({
                templateUrl: "forms/EHS/main.html",
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/Company', angularAMD.route({
                templateUrl: "forms/EHS/Company/search.html",
                controller: 'CompanyController',
                controllerUrl: 'controllers/EHS/Waste/CompanyController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/Method', angularAMD.route({
                templateUrl: "forms/EHS/Method/search.html",
                controller: 'MethodProcessController',
                controllerUrl: 'controllers/EHS/Waste/MethodProcessController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/Voucher/print/:code', angularAMD.route({
                templateUrl: "forms/EHS/Voucher/detail.html",
                controller: 'VoucherDetailController',
                controllerUrl: 'controllers/EHS/Waste/VoucherDetailController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/WasteItem', angularAMD.route({
                templateUrl: "forms/EHS/WasteItem/search.html",
                controller: 'WasteItemController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/Voucher', angularAMD.route({
                templateUrl: "forms/EHS/Voucher/search.html",
                controller: 'VoucherController',
                controllerUrl: 'controllers/EHS/Waste/VoucherController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/GiangVien', angularAMD.route({
                templateUrl: "forms/ths/GiangVien/search.html",
                controller: 'GiangVienController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/WasteItem', angularAMD.route({
                templateUrl: "forms/EHS/WasteItem/search.html",
                controller: 'WasteItemController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/WasteItem', angularAMD.route({
                templateUrl: "forms/EHS/WasteItem/search.html",
                controller: 'WasteItemController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/WasteItem', angularAMD.route({
                templateUrl: "forms/EHS/WasteItem/search.html",
                controller: 'WasteItemController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/waste/WasteItem', angularAMD.route({
                templateUrl: "forms/EHS/WasteItem/search.html",
                controller: 'WasteItemController',
                controllerUrl: 'controllers/EHS/Waste/WasteItemController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/HocVien', angularAMD.route({
                templateUrl: "forms/ths/HocVien/search.html",
                controller: 'HocVienController',
                controllerUrl: 'controllers/ths/HocVienController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/GiangVien', angularAMD.route({
                templateUrl: "forms/ths/GiangVien/search.html",
                controller: 'GiangVienController',
                controllerUrl: 'controllers/ths/GiangVienController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    } 
                }
            }))
            .when('/ths/DeTaiLuanVan', angularAMD.route({
                templateUrl: "forms/ths/DeTaiLuanVan/search.html",
                controller: 'DeTaiLuanVanController',
                controllerUrl: 'controllers/ths/DeTaiLuanVanController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/HDDC', angularAMD.route({
                templateUrl: "forms/ths/HDDC/search.html",
                controller: 'HDDCController',
                controllerUrl: 'controllers/ths/HDDCController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/HDLV', angularAMD.route({
                templateUrl: "forms/ths/HDLV/search.html",
                controller: 'HDLVController',
                controllerUrl: 'controllers/ths/HDLVController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/DangKyDeTai', angularAMD.route({
                templateUrl: "forms/ths/DangKyDeTai/search.html",
                controller: 'DangKyDeTaiController',
                controllerUrl: 'controllers/ths/DangKyDeTaiController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/ChuyenMon', angularAMD.route({
                templateUrl: "forms/ths/ChuyenMon/search.html",
                controller: 'ChuyenMonController',
                controllerUrl: 'controllers/ths/ChuyenMonController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/ChuyenNganh', angularAMD.route({
                templateUrl: "forms/ths/ChuyenNganh/search.html",
                controller: 'ChuyenNganhController',
                controllerUrl: 'controllers/ths/ChuyenNganhController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/DonViNgoai', angularAMD.route({
                templateUrl: "forms/ths/DonViNgoai/search.html",
                controller: 'DonViNgoaiController',
                controllerUrl: 'controllers/ths/DonViNgoaiController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/ths/NienKhoa', angularAMD.route({
                templateUrl: "forms/ths/NienKhoa/search.html",
                controller: 'NienKhoaController',
                controllerUrl: 'controllers/ths/NienKhoaController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
            .when('/THS/BoMon', angularAMD.route({
                templateUrl: "forms/THS/BoMon/searchBM.html",
                controller: 'BoMonController',
                controllerUrl: 'controllers/THS/BoMonController',
                caseInsensitiveMatch: true,
                resolve: {
                    User: function (AuthenticationLoader) {
                        return AuthenticationLoader();
                    }
                }
            }))
    }]);
    return angularAMD.bootstrap(app);
});