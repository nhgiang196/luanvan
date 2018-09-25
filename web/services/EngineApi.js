/**
 * Created by wangyanyan on 14-3-3.
 */
define( ['app','angular'],function(app,angular){
    app.service("EngineApi",[ '$resource','$q','Auth','$location', function($resource,$q,Auth,$location) {
        function EngineApi(){

            //代理人的设置
          this.proxyUser=$resource("/ehs/bpm/proxyUser",{},{
              get:{method:'Get',isArray: true},

              add: { method: 'POST'},
              delete: { method: 'DELETE'},
              getProxyWF:{method:'PUT',isArray: true}

          })
            this.getByName = $resource("/ehs/bpm/ProxyUserByName",{},{
                get:{method:'GET',isArray:true}
        });
            this.MyproxyUser=$resource("/ehs/bpm/MyproxyUser",{},{

                myget:{method:'GET',isArray:true}
            })
            //login


            this.loginValidate=  $resource("/authorize/:operation/:id", { id: "@id" }, {
                loginToken: { method: 'POST', params : {operation: "loginToken" }},//tang nan login cas
                loginCode: { method: 'POST', params : {operation: "loginCode" }},// ateam login cas
                login: { method: 'POST', params : {operation: "login" }}
            })

            //工号的得到姓名 api GetEmployeeInfo
            var employeeurl="/ehs/employeeInfo/:userid"
            this.getMember=  $resource(employeeurl, { userid: "@userid"} , {
                get : { method: 'GET'}
            })
            //邮件的发送
            this.sendMail = $resource("/ehs/moc/MailSend",  {  }, {
                send : { method: 'POST'}
            })

            //得到部门的领导
            var leaderUrl="/ehs/leader/:company/:department"
            this.getLeader=  $resource(leaderUrl, { company: "@company", department:"@department"} , {
                getList : { method: 'GET',isArray: true}
            });
            //得到部门

            this.getDepartmentList=  $resource("/ehs/department", { } , {
                getList : { method: 'GET',isArray: true}
            });

            //得到处理信息
            var processLogUrl = "/ehs/GetprocessLogs/:id/:cId?";
            this.getProcessLogs = $resource(processLogUrl,{id:"@id",cId:"@cId"},{
                getList:{method:'GET',isArray:true}
            });

            //得到部门下所有人员
            var departmentAllMemberUrl="/ehs/department/allmember/:department"
            this.getDepartmentAllMember=  $resource(departmentAllMemberUrl, { department: "@department"} , {
                getList : { method: 'GET',isArray: true}
            });


            this.getBasicMember=  $resource("/ehs/basic/employeeInfo/:userid", { userid: "@userid"} , {
                get : { method: 'GET'}
            })


            this.deploymentWorkflow=$resource("/bpm/api/deployment/create",{},{
                create:{method:'POST'}
            })
            var processDefinitionUrl = "/bpm/api/default/bpm-rest-api/process-definition/:id/:operation";
            this.processDefinition = $resource(processDefinitionUrl, { id: "@id" }, {
                get : { method: 'GET'},
                getDefinitionName:{ method: 'GET'},
                getList : { method: 'GET',isArray:true},
                getLastList: {  method: 'GET', isArray: true,  url:processDefinitionUrl+"?latest=true" },
                getdefkeyList: { method: 'GET', isArray: true, url:processDefinitionUrl+"?key=:key"},
                xml : { method: 'GET', params : { operation: "xml" }}
            })
        //    http://demo.feg.cn:9999/default/bpm-rest-api/process-definition/key/GongAnV2Process
            this.getKey=    $resource("/bpm/api/default/bpm-rest-api/process-definition/key/:key", { key: "@key" } , {
                getkey : { method: 'GET'}
            });
            this.nStart=    $resource("/bpm/start/:id", { id: "@id" } , {
                start : { method: 'GET'}
            });
            //,headers:{'Authorization':  Auth.username}
            this.nStartProcess=  $resource("/bpm/startDefinition/:id/:operation", { id: "@id" } , {
                start : { method: 'POST', params : { operation: "start" }}
            });
            var jobUrl = "/bpm/api/default/bpm-rest-api/job/:id/:operation";
            this.Jobsetting=    $resource(jobUrl, { id: "@id" }, {
                get: { method:'GET' },
                getList : { method: 'GET',isArray:true},
                duedate: { method: 'PUT', params : {operation: "duedate" }}//设置job的时间
            });
            var taskUrl = "/bpm/api/default/bpm-rest-api/task/:id/:operation";
            this.taskList =
                $resource(taskUrl, { id: "@id" }, {
                    get: { method:'GET' },
                    getList : { method: 'GET',isArray:true},
                    getMyList: { method: 'GET',isArray: true,url:taskUrl+"?assignee=:assignee" },
                    claim: { method: 'POST', params : {operation: "claim" }},
                    unclaim: { method: 'POST', params : {operation: "unclaim" }},
                    complete: { method: 'POST', params : {operation: "complete" }},//完成任务
                    resolve: { method: 'POST', params : {operation: "resolve" }},
                    delegate: { method: 'POST', params : {operation: "delegate" }},
                    assignee: { method: 'POST', params : {operation: "assignee" }},
                    identitylinks: { method: 'GET', params : {operation: "identity-links" },isArray:true}
                });

            this.ProcessVariableInstace=$resource("/bpm/api/default/bpm-rest-api/variable-instance",{},{
                getVar:{method:'GET',isArray:true}
            })
            this.nTaskform= $resource("/bpm/task/:id", { id: "@id" }, {
                  getForm : { method: 'GET'}
            });

            this.nTaskProcess=  $resource("/bpm/task/:id/:operation", { id: "@id" } , {
                complete : { method: 'POST', params : { operation: "complete" }}
            });
            this.taskCount = $resource("/bpm/api/default/bpm-rest-api/task/count");
            this.processInstance = $resource("/bpm/api/default/bpm-rest-api/process-instance/:id/:operation", { id: "@id" } , {
                variables : { method: 'GET', params : { operation: "variables" }},
                get: { method: 'GET',isArray:true}


            });


            var historyTaskUrl="/bpm/api/default/bpm-rest-api/history/task";
            this.historyTaskList =
                $resource(historyTaskUrl, { id: "@id" } , {
                    get: { method: 'GET'},
                    getTaskList: { method: 'GET',isArray:true}
                });
        //查询历史流程进程记录

            var historyProcessUrl="/bpm/api/default/bpm-rest-api/history/process-instance/:id";
            this.historyProcessList =
                  $resource(historyProcessUrl, { id: "@id" } , {
                      get: { method: 'GET'},
                     getHistoryList: { method: 'GET',isArray:true}
                });
            var historyActivityUrl="/bpm/api/default/bpm-rest-api/history/activity-instance";
            this.historyActivityList =
                $resource(historyActivityUrl, { id: "@id" } , {
                    get: { method: 'GET'},
                    getList: { method: 'GET',isArray:true}
                });
            var historyOperationUrl="/bpm/api/default/bpm-rest-api/history/user-operation";
            this.historyOperationList =
                $resource(historyOperationUrl, {id:"@id"} ,{

                    getList: { method: 'GET',isArray:true}
                });


            var tcodeurl="/bpm/CheckTCode/:userid/:tcode";
            this.tcodeLink=  $resource(tcodeurl , { userid: "@userid",tcode :"@tcode"} , {
                get: { method: 'GET'}
            });


        }
        EngineApi.prototype.ProcessVariable=function(){
            return this.ProcessVariableInstace;
        }

        //启动流程KEYNAME 得到流程ID
        EngineApi.prototype.startFlowbyKeyname=function(keyname) {
            var deferred = $q.defer();
            var $this=this;
            if (Auth.username) {
                $this.getTcodeLink().get({"userid": Auth.username, "tcode": keyname}).$promise.then(function (linkres) {
                    if (!linkres.IsSuccess) {
                        deferred.reject('没有权限.');
                    } else {
                        $this.getKeyId().getkey({
                            "key": keyname
                        }).$promise.then(function (FlowDefinition) {
                                if (FlowDefinition.id) {

                                    deferred.resolve(FlowDefinition.id);
                                } else {
                                    deferred.reject('获得流程定义出错.');
                                }
                            })
                    }
                });
            }
            else {
                $location.path('/login');
            }
            return deferred.promise;

        }
        EngineApi.prototype.DologinValidate=function(){
            return this.loginValidate;
        }
        EngineApi.prototype.TosendMail=function(){
            return this.sendMail;
        }
        EngineApi.prototype.getTcodeLink= function() {
            return this.tcodeLink;
        };
        EngineApi.prototype.getProcessInstance = function() {
            return this.processInstance;
        };
        EngineApi.prototype.DoJob=function(){
            return this.Jobsetting;
        }
        EngineApi.prototype.getMemberInfo=function(){
            return this.getMember;
        }
        EngineApi.prototype.getBasicMemberInfo=function(){
            return this.getBasicMember;
        }

        EngineApi.prototype.gethistoryActivityList=function(){
            return this.historyActivityList;
        }
        EngineApi.prototype.getHistoryTaskList=function(){
            return this.historyTaskList;
        }
        EngineApi.prototype.getHistoryOperationList= function() {
            return this.historyOperationList;
        };

        EngineApi.prototype.getLeaderList=function(){

            return this.getLeader;
        }
        EngineApi.prototype.getDepartment=function(){

            return this.getDepartmentList;
        }

        EngineApi.prototype.getProcessLogs = function(){
            return this.getProcessLogs;
        };

        EngineApi.prototype.getDepartmentAllMember=function(){

            return this.getDepartmentAllMember;
        }


        EngineApi.prototype.getKeyId=function(){
            return this.getKey;
        }
        EngineApi.prototype.doTask = function() {
            return this.nTaskProcess;
        };
        EngineApi.prototype.getTaskform = function() {
            return this.nTaskform;
        };
        EngineApi.prototype.getTasks = function() {
            return this.taskList;
        };
        EngineApi.prototype.getProcessDefinitions = function() {
            return this.processDefinition;
        };

        EngineApi.prototype.getStart = function() {
            return this.nStart;
        };
        EngineApi.prototype.doStart = function() {
            return this.nStartProcess;
        };
        EngineApi.prototype.getTaskCount = function () {
            return this.taskCount;
        };

        EngineApi.prototype.getColleagueCount = function (userId) {
            return this.taskCount.get({ assignee: userId });
        };

        EngineApi.prototype.gethistoryProcessList=function(){
            return this.historyProcessList;
        }
        EngineApi.prototype.gethistoryTaskList=function(){
            return this.historyTaskList;
        }
        EngineApi.prototype.getMyProxyUser=function(){
            return this. MyproxyUser
        }
        EngineApi.prototype.getProxyUser=function(){
            return this.proxyUser;
        }
        EngineApi.prototype.GetByName=function(){
            return this.getByName;
        }
        EngineApi.prototype.DeploymentBpmn=function(){
            return this.deploymentWorkflow;
        }
       

        return new EngineApi();

    }])


});