/**
 * Created by wang.chen on 2016/12/5.
 */
/**
 * Created by wangyanyan on 2015-03-18.
 */
define( ['app','angular'],function(app,angular) {
    app.service("TPMEngine", [ '$resource','$http','Notifications', function ($resource,$http,Notifications) {

        function TPMEngine(){

            this.queryLinesByDepartmnet= $resource("/ehs/moc/tpm/getLinesByDepartment", {}, {
                getList: { method: 'GET', isArray: true}
            });
            this.queryOs = $resource("/ehs/tpm/GetEquipmentsOS/:departmentID", { departmentID: "@departmentID"}, {
                getList: { method: 'GET', isArray: true}
            });

            this.EquipmentCodebyName= $resource("/ehs/tpm/GetEquipmentCodeByName/:name", { name: "@name"}, {
                getList: { method: 'GET', isArray: true}
            });
            this.EquipmentCodeByDepartment= $resource("/ehs/moc/tpm/GetEquipmentCodeByDepartment", { }, {
                getList: { method: 'GET', isArray: true}
            });
            this.EquipmentCodeV3= $resource("/ehs/moc/tpm/getEquipmentCodeV3", { }, {
                get: { method: 'GET', isArray: true}
            });

            this.EquipmentDepartments=$resource("/ehs/moc/tpm/getDepartments",{}, {
                getList: { method: 'GET', isArray: true}
            });
            this.queryTPMEnginner_XC = $resource("/ehs/tpm/GetTPMEnginner_XC/:departmentID", { departmentID: "@departmentID"}, {
                getList: { method: 'GET', isArray: true}
            });
            this.queryEquipmentLastinfo = $resource('/ehs/tpm/TEquipment/lastinfo/:equipmentCode', {equipmentCode:"@equipmentCode"},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipmentExceptioninfoV1 = $resource('/ehs/moc/tpm/GetEquipmentExceptionsByDate', {},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipmentExceptioninfo = $resource('/ehs/tpm/TEquipment/exception/:code', {code:"@code"},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipmentWorksByCodeDate = $resource('/ehs/moc/tpm/GetEquipmentWorksByCodeDate', {},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipmentcodes = $resource('/ehs/tpm/GetEquipmentsCode', {},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipmentcodeOnly = $resource('/ehs/tpm/GetEquipmentCode', {},   {
                get: { method: 'GET', isArray: true}
            });

            this.EquipmentsByLines = $resource('/ehs/moc/tpm/GetEquipmentsByLines', {},   {
                get: { method: 'GET', isArray: true}
            });
            this.queryEquipments= $resource('/ehs/tpm/TEquipments', {},   {
                get: { method: 'Get', isArray: true}
            });
            this.contractcardall = $resource('/ehs/contactcard/GetAllByCondition', {},   {
                getList : { method: 'GET',isArray:true}
            });
            this.contactcardReceivers=$resource("/ehs/contactcard/GetReceivers", { }, {
                get: { method: 'GET', isArray: true}
            });
            this.contractcard = $resource("/ehs/contactcard/:code", { code: "@code" }, {
                get : { method: 'GET'},

                getList : { method: 'GET',isArray:true}

            })
            this.contractcardinfo = $resource("/ehs/contactcard/info/:code", { code: "@code" }, {
                get : { method: 'GET'}
            })
            var cardworkurl = "/ehs/contactcard/Work/:code";
            this.contractcardWork = $resource(cardworkurl, { code: "@code" }, {
                get : { method: 'GET'}

            })

            this.contractcardZW=$resource("/ehs/contactcard/ZongWu/:code",{code:"@code"},{
                get:{method:'GET'}
            })
            this.contractcardCWork=$resource("/ehs/contactcard/CWork/:code",{code:"@code"},{
                get:{method:'GET'}
            })
            var eleurl = "/ehs/contactcard/Electrial/:code";
            this.contractcardElectrial = $resource(eleurl, { code: "@code" }, {
                get : { method: 'GET'}

            })
            var cardpurl = "/ehs/contactcard/Publicu/:code";
            this.contractcardPublicu = $resource(cardpurl, { code: "@code" }, {
                get : { method: 'GET'}

            })

            //得到TPM的所有的部门

            this.AllDepartments = $resource("/ehs/moc/GetAllDepartments", { }, {
                get : { method: 'GET', isArray: true}

            })
            this.ReceiveSectionHeader = $resource("/ehs/tpm/GetReceiveSectionHead", { }, {
                get : { method: 'GET',isArray:true}

            })

            this.AllUserByDepartment = $resource("/ehs/tpm/GetAllUsersByDepartment", { }, {
                get : { method: 'GET',isArray:true}

            })
            this.EnginnerByDepartment = $resource("/ehs/tpm/GetDepartmentEnginner", { }, {
                get : { method: 'GET',isArray:true}

            })
            //获得设备履历表的文件列表
            this.EquipmentFileList = $resource("ehs/tpm/TEquipmentDoc/Get/:code",  { code: "@code" }, {
                get : { method: 'GET',isArray:true}

            });

            this.EquipmentFileListadd = $resource("ehs/tpm/TEquipmentDoc/Add",  {  }, {
                add : { method: 'POST',isArray:true}
            });


            this.EquipmentFileDelete= $resource("ehs/tpm/TEquipmentDoc/Delete/:ecode/:code",  { ecode:"ecode",code: "@code" }, {
                deletefile : { method: 'DELETE'}

            });
            this.EquipmentInfo = $resource("ehs/tpm/TEquipment/info/:code",  { code: "@code" }, {
                get : { method: 'GET'}

            });
            this.Equipmentbasic = $resource("ehs/tpm/TEquipment/basic/:code",  { code: "@code" }, {
                get : { method: 'GET'},
                delete:{method:'DELETE'},
                add : { method: 'POST'}
            });

            this.EquipmentbasicUpdate = $resource("ehs/tpm/TEquipment/basicUpdate", {}, {
                update : { method: 'POST'}
            });

            this.EquipmentDocchange = $resource("ehs/tpm/TEquipmentDocChange/Get/:ecode/:code",  {ecode:"@ecode",code: "@code" }, {
                get : { method: 'GET',isArray:true}

            });

            this.EquipmentDocchangeadd = $resource("ehs/tpm/TEquipmentDocChange/Add",  { }, {
                add : { method: 'POST'}

            });

            this.EquipmentDocchangedelete = $resource("ehs/tpm/TEquipmentDocChange/Get/:ecode/:code/:stamp",  {ecode:"@ecode",code: "@code", stamp:"@stamp" }, {
                deletefile : { method: 'DELETE'}

            });
            this.Equipmentparadelete = $resource("ehs/tpm/EquipmentPara/Delete/:ecode/:name",  {ecode: "@ecode",name:"@name"}, {
                add : { method: 'DELETE'}

            });
            this.Equipmentparaadd = $resource("ehs/tpm/EquipmentPara/Add",  {}, {
                add : { method: 'POST'}

            });
            this.Equipmentpara = $resource("ehs/tpm/EquipmentPara/Get/:code",  {code: "@code"}, {
                get : { method: 'GET',isArray:true}

            });
            this.Equipmentdetail = $resource("ehs/tpm/TEquipment/detailinfo/:code",  {code: "@code"}, {
                get : { method: 'GET'}
            });
            this.Equipmentplandelete = $resource("ehs/tpm/EquipmentPlan/:planid",  {planid: "@planid"}, {
                delete : { method: 'DELETE'}

            });
            this.Equipmentplanadd = $resource("ehs/tpm/EquipmentPlan/Add",  {}, {
                add : { method: 'POST'}

            });


            this.Equipmentplan = $resource("ehs/tpm/EquipmentPlans/Get",  {}, {
                get : { method: 'GET',isArray:true}
            });


            //无用
            this.Equipmentplanxh = $resource("ehs/tpm/EquipmentPlanXhs/:planid",  {planid:"@planid"}, {
                get : { method: 'GET',isArray:true}
            });
            this.EquipmentBugadd = $resource("ehs/tpm/EquipmentBug/Add",  {}, {
                add : { method: 'POST'}

            });

            this.EquipmentBugs = $resource("ehs/tpm/EquipmentBugs/Get",  {}, {
                get : { method: 'GET',isArray:true}

            });
            this.EquipmentRepairs = $resource("ehs/tpm/EquipmentRepair/list",  {}, {
                get : { method: 'GET',isArray:true}

            });
            this.EquipmentTaskCount=  $resource("ehs/tpm/TEquipment/Task/:operation", { } , {
                taskydmj : { method: 'GET',  isArray: true,params : { operation: "YD_MJ" }},
                taskydmaj : { method: 'GET',  isArray: true,params : { operation: "YD_MAJ" }},
                taskydxh : { method: 'GET',  isArray: true,params : { operation: "YD_XH" }},
                taskjwxh : { method: 'GET',  isArray: true,params : { operation: "JW_XH" }},
                taskjwxj : { method: 'GET',  isArray: true,params : { operation: "JW_XJ" }},
                taskgyxj : { method: 'GET',  isArray: true,params : { operation: "GY_XJ" }},
                taskgyxh : { method: 'GET',  isArray: true,params : { operation: "GY_XH" }},
                taskall : { method: 'GET',  isArray: true,params : { operation: "ALL" }}
            });
            this.EquipmentTasklist=  $resource("ehs/tpm/TEquipment/Tasklist", {} , {
                get : { method: 'GET',  isArray: true}
                //  add : { method: 'POST'} 只能用$http
            });

            this.EquipmentRepair=  $resource("ehs/tpm/EquipmentRepair/Get/:code", {code:"@code" } , {
                get : { method: 'GET'}
            });
            this.EquipmentPlanUpdate = $resource("ehs/tpm/EquipmentPlan/Put/LastDate", {}, {
                add : { method: 'POST',  isArray: true}
            });

            this.EquipmentPlansAll=$resource("/ehs/moc/tpm/QueryEquipmentPlansByAll",{},{
                getList:{method:'Get',  isArray: true}
            });

            this.EquipmentTasksAll=  $resource("/ehs/moc/tpm/QueryEquipmentTasksAll", {} , {
                getList : { method: 'GET',  isArray: true}
                //  add : { method: 'POST'} 只能用$http
            });
            //浏览工作日志的痕迹
            this.Worklogs = $resource("/ehs/moc/tpm/GetWorklogs",  {}, {
                get : { method: 'GET',isArray:true}
            });
            //得到巡检异常
            this.TaskBugs = $resource("/ehs/moc/tpm/GetTaskBugs",  {}, {
                get : { method: 'GET',isArray:true}
            });
            //得到工作日志的数量
            this.Workcount = $resource("/ehs/moc/tpm/GetWorkCount",  {}, {
                get : { method: 'GET',isArray:true}
            });
            this.QueryDepartment = $resource("/ehs/moc/tpm/getQueryDepartment",  {}, {
                get : { method: 'GET',isArray:true}
            });
            this.QueryDepartmentByuser = $resource("/ehs/moc/tpm/getDepartmentByuser",  {}, {
                get : { method: 'GET',isArray:true}
            });
            this.WorkReport = $resource("/ehs/moc/tpm/AddWorkReport", {}, {
                add : { method: 'POST'}
            });
            this.DWorkReport = $resource("/ehs/moc/tpm/DeleteWorkReport", {}, {
                delete : { method: 'POST'}
            });

            this.GetEquipmentResult = $resource("/ehs/moc/tpm/getEquipmentResult",{},{
                getList:{method:'GET',params : {operation: ""},isArray:true}
            });

            this.GetEquipmentDeviation = $resource("/ehs/moc/tpm/getEquipmentDeviation",{},{
                getList:{method:'GET',params:{operation:""},isArray:true}
            });

            this.queryWorkReport = $resource("/ehs/moc/tpm/GetWorkReport", {}, {
                get : { method: 'GET',isArray:true}
            });
            this.Querycardlv = $resource("/ehs/moc/tpm/Querycardlv", {}, {
                get : { method: 'GET',isArray:true}
            });
            //防雷检测任务
            this.LightTasklist=  $resource("ehs/Light/TaskList/:userId", {userId:"@userId"} , {
                get : { method: 'GET',  isArray: true}
            });

            //工作日志的
            this.WorkDayCheck = $resource("/ehs/moc/tpm/CheckWorkRecordHeader", {}, {
                check : { method: 'POST'}
            });
            this.WorkweekReport = $resource("/ehs/moc/tpm/WorkweekReport/:operation", {}, {
                delete : { method: 'POST',params : {operation: "delete"}},
                add : { method: 'POST',params : {operation: "add"}},
                query : { method: 'GET',params : {operation: "query"},isArray:true}
            });
            this.WorkReportAuth = $resource("/ehs/moc/tpm/WorkReportAuth", {}, {
                auth : { method: 'POST'}
            });

            this.CZEquipmentList= $resource("/ehs/moc/tpm/getEquipmentByCZ/:operation",{}, {
                getList : { method: 'GET',params : {operation: ""},  isArray: true},
                getTasks : { method: 'GET',params : {operation: "task"},  isArray: true}
            });
            //带病工作设备查询
            this.EquipmentSicksAll=  $resource("/ehs/moc/tpm/QueryEquipmentSicksAll", {} , {
                getList : { method: 'GET',  isArray: true}
            });
            //测振的阀值的修改
            this.EquipmentThreshold=$resource("ehs/tpm/TEquipment/Tasklist/ThresholdList",{},{
                getList:{method:'GET',isArray:true,params:{} }

            });
            //测振的阀值的删除
            this.EquipmentThresholdDel = $resource("ehs/tpm/TEquipment/Tasklist/ThresholdDel/:code",  { code: "@code" }, {
                delete:{method:'DELETE'}
            });
            //仪电热气象的管理
            this.EquipmentAbnormal=$resource("ehs/tpm/XJAbnormal/:operation",{},{
                getList : { method: 'GET',  isArray: true,params:{operation:"Lists"}},
                add : { method: 'POST',  isArray: true,params:{operation:"Add"}}
            });

            //PDA  通过转发
            this.PDAEquipment=$resource("ehs/tpm/PDA/:operation",{},{
                getList : { method: 'GET',  isArray: true,params:{operation:"PlanLists"}},
                delete : { method: 'DELETE',  isArray: true,params:{operation:"DeletePlanItem"}},
                savepi : { method: 'GET',  isArray: true,params:{operation:"SavePlanItem"}},
                add : { method: 'POST',  isArray: true,params:{operation:"CreatePlan"}},
                createJson : { method: 'GET',  params:{operation:"CreateJsonCB"}}
            });
            //得到巡检的类型
            this.PADKinds=$resource("ehs/pad/GetPADKinds",{},{
                getList : { method: 'GET',  isArray: true}
            });

            this.PDAEquipmentSetting=$resource("ehs/pda/FormSchema/Setting",{},{
                getList : { method: 'GET',  isArray: true}
            });

            this.PDATaskLogs=$resource("ehs/pad/Task/Get",{},{
                getList : { method: 'GET',  isArray: true}
            });

            this.PDATaskLogsTips=$resource("ehs/pad/Task/GetTips",{},{
                getList : { method: 'GET',  isArray: true}
            });

            this.PDATaskPlanTime=$resource("ehs/pad/Task/GetTime",{},{
                getList : { method: 'GET',  isArray: true}
            });

            this.PDAAlarmReport=$resource("ehs/pad/AlarmReport/:operation",{},{
                getList : { method: 'GET',  isArray: true,params:{operation:"PdaAlarmLists"}},
                getTimes : { method: 'GET',  isArray: true,params:{operation:"PdaTimeLists"}},
                getTimesDetails : { method: 'GET',  isArray: true,params:{operation:"PdaTimeDetails"}},
                savepi : { method: 'POST',  isArray: true,params:{operation:"SaveResult"}},
                saveReason : { method: 'POST',  isArray: true,params:{operation:"SaveReason"}}
            });

            this.PADEquipmentCode=$resource("ehs/pad/GetPADEquipmentCode",{},{
                getList : { method: 'GET',  isArray: true}
            });

        }
        TPMEngine.prototype.DoPADEquipmentCode=function(){
            return this.PADEquipmentCode;
        };
        TPMEngine.prototype.DoPADKinds=function(){
            return this.PADKinds;
        };
        TPMEngine.prototype.DoPDAEquipment=function(){
            return this.PDAEquipment;
        };
        TPMEngine.prototype.DoPDAEquipmentSetting=function(){
            return this.PDAEquipmentSetting;
        };
        TPMEngine.prototype.DoPDATaskLogs=function(){
            return this.PDATaskLogs;
        };
        TPMEngine.prototype.DoPDATaskLogsTips=function(){
            return this.PDATaskLogsTips;
        };
        TPMEngine.prototype.DoPDATaskPlanTime=function(){
            return this.PDATaskPlanTime;
        };
        TPMEngine.prototype.DoPDAAlarmReport=function(){
            return this.PDAAlarmReport;
        };
        TPMEngine.prototype.DoPDAAlarmReason=function(){
            return this.PDAAlarmReason;
        };

        TPMEngine.prototype.DoEquipmentAbnormal=function(){
            return this.EquipmentAbnormal;
        };


        TPMEngine.prototype.EquipmentThresholdList=function(){
            return this.EquipmentThreshold;
        };

        TPMEngine.prototype.EquipmentThresholdDelete=function(){
            return this.EquipmentThresholdDel;
        };

        TPMEngine.prototype.GetEquipmentSicksAll=function(){
            return this.EquipmentSicksAll;
        };
        TPMEngine.prototype.QueryEquipmentByCZ=function(){
            return this.CZEquipmentList;
        };
        TPMEngine.prototype.DoWorkweekReport=function(){
            return this.WorkweekReport;
        };
        TPMEngine.prototype.AuthWorkReport=function(){
            return this.WorkReportAuth;
        };
        TPMEngine.prototype.DoWorkDayCheck=function(){
            return this.WorkDayCheck;
        };
        //防雷检测任务
        TPMEngine.prototype.DoLightTask=function(){
            return this.LightTasklist;
        };
        TPMEngine.prototype.GetWorkReport=function(){
            return this.queryWorkReport;
        };
        TPMEngine.prototype.GetWorkReport=function(){
            return this.queryWorkReport;
        };
        TPMEngine.prototype.GetCardLv=function(){
            return this.Querycardlv;
        };
        TPMEngine.prototype.AddWorkReport=function(){
            return this.WorkReport;
        };
        TPMEngine.prototype.DeleteWorkReport=function(){
            return this.DWorkReport;
        };
        TPMEngine.prototype.GetQueryDepartment=function(){
            return this.QueryDepartment;
        };
        TPMEngine.prototype.GetQueryDepartmentByuser=function(){
            return this.QueryDepartmentByuser;
        };

        TPMEngine.prototype.GetWorkcount=function(){
            return this.Workcount;
        };
        TPMEngine.prototype.GetTaskBugs=function(){
            return this.TaskBugs;
        };
        TPMEngine.prototype.GetWorklogs=function(){
            return this.Worklogs;
        };
        TPMEngine.prototype.GetEquipmentTasksAll=function(){
            return this.EquipmentTasksAll;
        };
        //查询巡检计划
        TPMEngine.prototype.GetEquipmentPlansAll=function(){
            return this.EquipmentPlansAll;
        };
        //查询线别
        TPMEngine.prototype.GetLinesByDepartmnet=function(){
            return this.queryLinesByDepartmnet;
        };
        TPMEngine.prototype.updateEquipmentPlan = function() {
            return this.EquipmentPlanUpdate;
        };
        TPMEngine.prototype.getEquipmentRepairs=function(){
            return this.EquipmentRepairs();
        };
        TPMEngine.prototype.getEquipmentRepair=function(){
            return this.EquipmentRepair;
        };
        TPMEngine.prototype.getEquipmentplanxh=function(){
            return this.Equipmentplanxh;
        };
        TPMEngine.prototype.DoEquipmentTaskCount=function(){
            return this.EquipmentTaskCount;
        };
        TPMEngine.prototype.DoEquipmentTask=function(){
            return this.EquipmentTasklist;
        };
        /*   设备故障      */
        TPMEngine.prototype.addEquipmentBug=function(){
            return this.EquipmentBugadd;
        };
        TPMEngine.prototype.getEquipmentBugs=function(){

            return this.EquipmentBugs;
        };
        /*         start 设备履历*/
        TPMEngine.prototype.getEquipmentdetail=function(){

            return this.Equipmentdetail;
        };
        ///保养 维护的日志的 最近的一笔和下次的时间
        TPMEngine.prototype.getQueryEquipmentLastinfo=function(){
            return this.queryEquipmentLastinfo;
        }
        TPMEngine.prototype.getqueryEquipmentExceptioninfo=function(){
            return this.queryEquipmentExceptioninfo;
        };
        TPMEngine.prototype.getEquipmentExceptioninfoV1=function(){

            return this.queryEquipmentExceptioninfoV1;
        };
        TPMEngine.prototype.getEquipmentWorksByCodeDate=function(){
            return this.queryEquipmentWorksByCodeDate;
        };
        //计划
        TPMEngine.prototype.getEquipmentplan=function(){

            return this.Equipmentplan;
        };
        TPMEngine.prototype.addEquipmentplan=function(){

            return this.Equipmentplanadd;
        };

        TPMEngine.prototype.deleteEquipmentplan=function(){

            return this.Equipmentplandelete;
        };
        //delete设备履历PARA
        TPMEngine.prototype.deleteEquipmentpara=function(){

            return this.Equipmentparadelete;
        };


        //add设备履历PARA
        TPMEngine.prototype.addEquipmentpara=function(){

            return this.Equipmentparaadd;
        };
        //查询设备履历PARA
        TPMEngine.prototype.getEquipmentpara=function(){

            return this.Equipmentpara;
        };
        //查询设备履历这个文件下的变更记录
        TPMEngine.prototype.getEquipmentDocchange=function(){

            return this.EquipmentDocchange;
        };
        //新增设备履历这个文件下的变更记录
        TPMEngine.prototype.addEquipmentDocchange=function(){

            return this.EquipmentDocchangeadd;
        };
        //删除设备履历这个文件下的变更记录
        TPMEngine.prototype.deleteEquipmentDocchange=function(){

            return this.EquipmentDocchangedelete;
        };
        ///查询所有的设备履历
        TPMEngine.prototype.getQueryEquipments=function(){

            return this.queryEquipments;
        };
        //删除所有的设备履历这个文件下
        TPMEngine.prototype.deleteEquipmentFile=function(){

            return this.EquipmentFileDelete;
        };

        TPMEngine.prototype.getEquipmentResult=function(){
            return this.GetEquipmentResult;
        };

        TPMEngine.prototype.getEquipmentDeviation = function(){
            return this.GetEquipmentDeviation;
        };
        //  //获得设备履历表的文件列表
        TPMEngine.prototype.getEquipmentFileList=function(){

            return this.EquipmentFileList;
        };
        //新增设备履历这个文件
        TPMEngine.prototype.getEquipmentFileListadd=function(){

            return this.EquipmentFileListadd;
        };
        // 新增设备履历主数据
        TPMEngine.prototype.getEquipmentInfo=function(){

            return this.EquipmentInfo;
        };

        TPMEngine.prototype.getEquipmentbasic=function(){

            return this.Equipmentbasic;
        };

        TPMEngine.prototype.DoEquipmentbasicUpdate=function(){
            return this.EquipmentbasicUpdate;
        };
        /*         end 设备履历*/

        TPMEngine.prototype.getLeaderfromKJ= function(departmentID,callback) {
            $http.get('/ehs/moc/GetcheckerbycenterID/'+departmentID+'/12').success(function(data){
                callback(data);
            }).error(function (data) {
                //
                callback(null);
            });

        };
        TPMEngine.prototype.getCheckLeader= function(departmentID,LevelType,callback) {
            $http.get('/ehs/moc/GetcheckerbycenterID/'+departmentID+'/'+LevelType).success(function(data){
                callback(data);
            }).error(function (data) {
                //
                callback(null);
            });
        };
        //联系单的查询list
        TPMEngine.prototype.getContractcardall=function(){

            return this.contractcardall;
        };
        TPMEngine.prototype.getEnginnerByDepartment=function(){
            return this.EnginnerByDepartment;
        };
        TPMEngine.prototype.getAllUserByDepartment = function() {
            return this.AllUserByDepartment;
        };
        TPMEngine.prototype.getReceiveManger = function(Receive,callback ) {
            $http.get('/ehs/tpm/GetReceiveManager?receive=' + Receive).success(function (data) {
                if (!data) {
                    callback(null);

                } else {
                    callback(JSON.parse(data));
                }});
        };
        TPMEngine.prototype.getMaintener=function(userid,opera,callback){
            $http.get('/ehs/tpm/GetMaintener?userid=' + userid+"&opera="+opera).success(function (data) {
                if (!data) {
                    callback(null);

                } else {
                    callback(data);
                }});

        };
        TPMEngine.prototype.getReceiveSectionHeaderNew = function(Receive,Code,callback ) {
            $http.get('/ehs/tpm/GetReceiveSectionHeadNew?receive=' + Receive+"&code="+Code).success(function (data) {
                if (!data) {
                    callback(null);

                } else {
                    callback(JSON.parse(data));
                }});
        };
        TPMEngine.prototype.putContractcard = function(code,card,callback) {

            $http.put("/ehs/contactcard/"+code,card).success(function(data,status){
                console.log(status);
                callback( status);
            }).error(function(data,status){
                // Notifications.addError({'status': 'error', 'message':"保存数据失败：" + status + data});

                callback(  "保存数据失败：" + status + data);
            });

        };
        TPMEngine.prototype.putContractcardStatus = function(code,callback) {

            $http.put("/ehs/contactcard/Done/"+code,{
            }).success(function(data,status){
                callback(status);
            }).error(function(data,status){

                callback("保存数据失败：" + status + data);
            });

        };
        TPMEngine.prototype.deleteContractcardStatus = function(code,callback) {

            $http.put("/ehs/contactcard/Delete/"+code,{
            }).success(function(data,status){
                callback(status);
            }).error(function(data,status){

                callback("保存数据失败：" + status + data);
            });

        };
        //得到设备的代码
        TPMEngine.prototype.getQueryEquipmentcodes = function() {
            return this.queryEquipmentcodes;
        };
        //得到设备的代码
        TPMEngine.prototype.getQueryEquipmentcodeOnly = function() {
            return this.queryEquipmentcodeOnly;
        };
        //得到设备的代码
        TPMEngine.prototype.GetEquipmentsByLines = function() {
            return this.EquipmentsByLines;
        };

        //得到线别和系统
        TPMEngine.prototype.getQueryOs = function() {
            return this.queryOs;
        };

        TPMEngine.prototype.getEquipmentCodebyName=function(){
            return this.EquipmentCodebyName;
        };
        TPMEngine.prototype.GetEquipmentCodeByDepartment=function(){
            return this.EquipmentCodeByDepartment;
        };

        TPMEngine.prototype.getEquipmentCodeV3=function(){
            return this.EquipmentCodeV3;
        };
        TPMEngine.prototype.GetEquipmentDepartments=function(){

            return this.EquipmentDepartments;
        };

        TPMEngine.prototype.getAllDepartments = function() {
            return this.AllDepartments;
        };
        TPMEngine.prototype.getReceiveSectionHeader = function() {
            return this.ReceiveSectionHeader;
        };


        TPMEngine.prototype.getContractcardinfo=function(){
            return this.contractcardinfo;
        };
        TPMEngine.prototype.getContactcardReceivers=function(){
            return this.contactcardReceivers;
        };
        TPMEngine.prototype.getContractcard = function() {
            return this.contractcard;
        };
        TPMEngine.prototype.getContractcardWork = function() {
            return this.contractcardWork;
        };
        TPMEngine.prototype.getcontractcardZW=function(){
            return this.contractcardZW;
        }
        TPMEngine.prototype.getcontractcardCWork=function(){
            return this.contractcardCWork;
        }

        TPMEngine.prototype.getcontractcardElectrial= function() {
            return this.contractcardElectrial;
        };
        TPMEngine.prototype.getcontractcardPublicu= function() {
            return this.contractcardPublicu;
        };

        TPMEngine.prototype.getTPMEnginner_XC=function(){

            return this.queryTPMEnginner_XC;
        }


        //职业卫生 安环处理人
        TPMEngine.prototype.GetANHealth=function(){
            return "140660";
        }
        //安环的科长
        TPMEngine.prototype.GetAnKeZhang=function(){
            return "980287";
        }
        //安环的证照管理处理人 徐伟峰
        TPMEngine.prototype.GetAnCer=function(){
            return "990401";
        }

        //安环的承揽商资质处理人 严小能
        TPMEngine.prototype.GetAnContractor=function(){
            return "140660";
        }


        TPMEngine.prototype.GetAdmin=function(){
            return "cassie";
        }
        return new TPMEngine();
    }])
});
