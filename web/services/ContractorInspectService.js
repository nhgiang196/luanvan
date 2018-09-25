/**
 * Created by wang.chen on 2016/12/5.
 */

define(['app','angular'],function(app,angular){
    app.service("ContractorInspectService",["$resource",function($resource){
        function ContractorInspectService(){
            //获取所有包商惩处条款
            var contractorRulesUrl = "/ehs/contractorinspect/rules";
            this.contractorRules = $resource(contractorRulesUrl, {  }, {
                get : { method: 'GET',isArray:true}
            });
            //获取所有包商信息
            var contractorsUrl = "/ehs/contractorinspect/contractors";
            this.contractors = $resource(contractorsUrl, {  }, {
                get : { method: 'GET',isArray:true}
            });

            //获取所有包商惩处条款title

            //查询承揽商
            var querycontractorsUrl = "/ehs/contractorinspect/query";
            this.querycontractors = $resource(querycontractorsUrl, { name: "@name" }, {
                get : { method: 'GET',isArray:true}

            })
            //新增承揽商
            var addcontractorsUrl = "/ehs/contractorinspect/add";
            this.addcontractors=$resource(addcontractorsUrl, {  }, {
                add: { method: 'POST'}
            });
            //删除承揽商
            var delcontractorsUrl = "/ehs/contractorinspect/del";
            this.delcontractors=$resource(delcontractorsUrl, {  }, {
                del: { method: 'POST'}
            });


            //包商的证照和正数的办理信息
            this.queryContractorsInfo = $resource("/ehs/Contractor/GetContractors/:operation", { operation: "@operation" }, {
                get : { method: 'GET',isArray:true},
                Ins: { method: 'GET', isArray:true,params : {operation: "Ins" }},
                Cer: { method: 'GET', isArray:true,params : {operation: "Cer" }}
            })
            this.queryContractorQuaProcess = $resource("/ehs/contractorQua/queryProcess", {}, {
                get : { method: 'GET',isArray:true}
            })

        }
        ContractorInspectService.prototype.getContractorQuaProcess=function(){
            return this.queryContractorQuaProcess
        }
        // 包商的证照和正数的办理信息
        ContractorInspectService.prototype.getContractorsInfo = function() {
            return this.queryContractorsInfo;
        };
        //获取所有包商惩处条例
        ContractorInspectService.prototype.getContractorRules = function() {
            return this.contractorRules;
        };
        //获取所有包商信息
        ContractorInspectService.prototype.getContractors = function() {
            return this.contractors;
        };
        //查询承揽商
        ContractorInspectService .prototype.getContractorsToDB = function() {
            return this.querycontractors;
        }
        //新增承揽商
        ContractorInspectService .prototype.addContractorsToDB = function() {
            return this.addcontractors;
        };
        //删除承揽商
        ContractorInspectService .prototype.delContractorsToDB = function() {
            return this.delcontractors;
        };


        return new ContractorInspectService();
    }]);
});
