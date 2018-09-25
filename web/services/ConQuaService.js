/**
 * Created by wang.chen on 2016/12/5.
 */
define(['app', 'angular'], function (app, angular) {
    app.service("ConQuaService", ['$resource', '$http', 'Auth', '$translate', function ($resource, $http, Auth, $translate) {
        function ConQuaService() {
            //承揽商类型 和种类
            this.ContractorKind = $resource("/ehs/gate/ConQua/GetContractorKind", {}, {
                get: {method: 'GET', isArray: true}
            });
            //查询
            this._ContractorQualification = $resource("/ehs/gate/ConQua/Get", {}, {
                get: {method: 'GET'},//
                getFile:{method:'GET', isArray: true},
                save:{method: 'POST'},
                getDetailHeader: {method: 'GET',isArray: true},
                getList: {method: 'GET',isArray: true},
                getFiles: {method: 'GET',isArray: true}
            });

            this.saveConQua = $resource("/ehs/gate/ConQua/Get",{},{
                save:{method:'POST'}
            });
            this.conQuaSaveStatus = $resource("/ehs/gate/ConQua/ConQuaSaveStatus", {}, {
                save:{method:'PUT'}
            });
            //得到ID and Name
            this.getContractorQualification = $resource("/ehs/gate/Contractor/GetContractorsInfo",{},{
                get:{method:'GET',isArray:true}
            });

            //得到 Cer
            this.getCerTypes = $resource("/ehs/gate/Contractor/GetCerTypes", {}, {
                get: {method: 'GET', isArray: true}
            });
            //得到 Issue
            this.getIssuedBy = $resource("/ehs/gate/Contractor/GetIssuedBy", {}, {
                get: {method: 'GET', isArray: true}
            });
            //
            this.getInsTypes = $resource("/ehs/gate/Contractor/GetInsTypes", {}, {
                get: {method: 'GET', isArray: true}
            });
            //save 办卡
            this.saveContractor = $resource("/ehs/gate/Contractor/Save", {}, {
                save: {method: 'POST'}
            });
            //get 办卡 a ID
            this.getContractor = $resource("/ehs/gate/Contractor/Get", {}, {
                get: {method: 'GET',isArray:true}
            });
            //办卡 Equipment
            this.getEquipmentList = $resource("/ehs/gate/Contractor/GetEquipment", {}, {
                get: {method: 'GET', isArray: true}
            });
            this.getIns = $resource("/ehs/gate/Contractor/GetIns", {}, {
                get: {method: 'GET'}
            });
            this.getCer = $resource("/ehs/gate/Contractor/GetCer", {}, {
                get: {method: 'GET'}
            });
            this.contractorDone = $resource("/ehs/gate/Contractor/Done", {}, {
                save:{method:'GET'}
            });
            this.contractorList = $resource("/ehs/gate/Contractor/GetContractors",{},{
                get:{method:'GET',isArray:true}
            });

            this.queryContractorQuaProcess = $resource("/ehs/contractorQua/queryProcess", {}, {
                get : { method: 'GET',isArray:true}
            })


            this.queryContractorPID = $resource("/ehs/ContractorInfo/PID", {}, {
                get : { method: 'GET',isArray:true}
            })
            this.queryContractorCancelPID = $resource("/ehs/ContractorCancel/PID", {}, {
                get : { method: 'GET',isArray:true}
            })

            this.ContraImport = $resource("/ehs/gate/Contractor/ImportSave",{},{
                save:{method:'POST'}
            });

            this.ContraImportRemove= $resource("/ehs/gate/Contractor/ImportRemove",{},{
                remove:{method:'POST'}
            });

            this.contractorStatistic = $resource("/ehs/gate/ConQua/CardLogs",{},{
                get:{method:'GET',isArray:true}
            })

            this.contractorStatisticDetail = $resource("/ehs/gate/ConQua/CardLogsDetail",{},{
                get:{method:'GET',isArray:true}
            })
        }
        ConQuaService.prototype.ContractorStatistic = function(){
            return this.contractorStatistic;
        }
        ConQuaService.prototype.ContractorStatisticDetail = function(){
            return this.contractorStatisticDetail;
        }
        ConQuaService.prototype.ContractorImport=function(){
            return this.ContraImport;
        };
        ConQuaService.prototype.ContractorImportRemove=function(){
            return this.ContraImportRemove;
        };
        ConQuaService.prototype.getContractorPID=function(){
            return this.queryContractorPID;
        };
        ConQuaService.prototype.getContractorCancelPID=function(){
            return this.queryContractorCancelPID;
        }
        ConQuaService.prototype.getContractorQuaProcess = function(){
            return this.queryContractorQuaProcess;
        };

        ConQuaService.prototype.ContractorDone = function(){
            return this.contractorDone;
        };
        ConQuaService.prototype.ConQuaSaveStatus = function(){
            return this.conQuaSaveStatus;
        };

        ConQuaService.prototype.GetContractor = function () {
            return this.getContractor;
        };
        ConQuaService.prototype.GetContractorQualification = function(){
            return this.getContractorQualification;
        };
        ConQuaService.prototype.ContractorList = function(){
            return this.contractorList;
        }
        ConQuaService.prototype.SaveContractor = function () {
            return this.saveContractor;
        };
        ConQuaService.prototype.GetEquipmentList = function () {
            return this.getEquipmentList;
        };
        ConQuaService.prototype.GetCerTypes = function () {
            return this.getCerTypes;
        };
        ConQuaService.prototype.GetIssuedBy = function () {
            return this.getIssuedBy;
        };
        ConQuaService.prototype.GetInsTypes = function () {
            return this.getInsTypes;
        };
        ConQuaService.prototype.ContractorQualification = function () {
            return this._ContractorQualification;
        };
        //增承揽商资质
        ConQuaService.prototype.CreateContractorQualification = function () {
            return this.saveConQua;
        };
        ConQuaService.prototype.GetIns = function () {
            return this.getIns;
        };
        ConQuaService.prototype.GetCer = function () {
            return this.getCer;
        };
        ConQuaService.prototype.ContractorTypeList = function () {
            return this.ContractorKind;
        };

        return new ConQuaService();
    }])
});
