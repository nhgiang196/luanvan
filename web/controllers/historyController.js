/**
 * Created by wangyanyan on 14-5-19.
 */

define( ['myapp','bpmn'],function(myapp,Bpmn,basicService){
myapp.controller("historyController",['$scope','EngineApi','$location','Forms','BasicService','$filter','$http','$resource','Notifications','User',function($scope,EngineApi,$location,Forms,BasicService,$filter,$http,$resource,Notifications,User){
    var today=new Date();
    var yesterday=today.getTime()-1000*60*60*24;
    var lastday=today.getTime()+1000*60*60*24;
    var currentday=$filter('date')(lastday,'yyyy-MM-dd');
   $scope.startTime=$filter('date')(yesterday,'yyyy-MM-dd');



   $scope.EndTime=currentday;
   $scope.applyUser=User;
   $scope.selectedprocess=null;
   $scope.isfinished=null;
   $scope.formHistory=null;

    $scope.options = [{lable:"",id:""},{lable:"完成",id:"true"},{lable:"未完成",id:"false"}];
$scope.getCurrentUser=function(obj,pid){
    var currentTask=[];
    EngineApi.getTasks().getList({processInstanceId:pid},function(ress){
        $scope.currentTask=ress;
        obj.html()
       /* var data={};
        data.userid=ress.assignee

        data.name=ress.name;
        data.description=ress.description;*/
    })

}
    $scope.submit = function() {
        var d1 = parseInt(new Date($scope.startTime).getTime()/1000/60/60/24);
        var d2 = parseInt(new Date( $scope.EndTime).getTime()/1000/60/60/24);
        var days = d1 - d2;
        if(days>7){
            Notifications.addError({'status': 'error', 'message':"开始时间间隔太长，请缩短查询时间间隔，最长7天" });
            return;
        }
        if(d1>d2){
            Notifications.addError({'status': 'error', 'message':"开始时间不能大于结束时间 "});
            return;
        }
        var queryjson={};
        var endtime=$filter('date')($scope.EndTime,'yyyy-MM-ddTHH:mm:ss');
        var starttime=$filter('date')($scope.startTime,'yyyy-MM-ddTHH:mm:ss');
        queryjson.processDefinitionKey=$scope.selectedprocess;
        queryjson.startedBefore=endtime;
        queryjson.startedAfter=starttime;


        if($scope.isfinished) {

            if($scope.isfinished==="true") {
                queryjson.finished = $scope.isfinished;
            }else{
                queryjson.unfinished ="true";
            }
        }
        if($scope.applyUser) {
            queryjson.startedBy = $scope.applyUser;
        }
        queryjson.sortBy="startTime";
        queryjson.sortOrder="desc";
        queryjson.maxResults=100;
        var formHistory=[];
        EngineApi.gethistoryProcessList().getHistoryList(queryjson,function(ress){
            console.log(ress.length);
            for (var i = 0, res; !!(res = ress[i]); i++) {


                    var data = {};
                    data.key = $("#selectedprocess").find("option:selected").text();
                    data.username = res.startUserId;
                    data.superProcessInstanceId = res.superProcessInstanceId;
                    //res.id
                    data.id=res.id;
                    data.deleteReason = res.deleteReason;
                    data.startTime = res.startTime;
                if( res.endTime){
                    data.color="#eee" ;
                }else{
                    data.color="#fcf8e3"
                }
                    data.endTime = res.endTime;

                    data.processDefinitionId = res.processDefinitionId;
                    data.processInstanceId = res.id;
                    getSuper(res.id,function(superList){
                        data.superEngin=superList;
                    })

                formHistory.push(data)


            }
            $scope.formHistory = formHistory;
        });

      /*  engineapi.gethistoryactivitylist.query({"activitytype": "startevent","sortby":"starttime","sortorder":"desc"}).$promise.then(function(res) {
            var formhistory=[];
            $.each(res, function(i,val){
                var data={};
               if( val.processdefinitionid==="gonganv2process:1:5ef7005b-0e47-11e4-bd16-0c84dc2d23af"){
                    data.pid=val.processinstanceid;


               }
            });
        });*/
      /*  BasicService.getFormHistory().queryList({key:$scope.selectedprocess},datafrom,function(res){
          //  $scope.formHistory=res;
            var formHistory=[];

            $.each(res, function(i,val){
                console.log(val.sync);
                var data={};
                data.key=$("#selectedprocess").find("option:selected").text();
                data.username=val.username;
                data.sync=val.sync;
                data.processDefinitionId=val.processDefinitionId;
                data.processInstanceId=val.processInstanceId;
                getStatus(val.processInstanceId,function(r){
                    data.status=r;
                    if($scope.isfinished){
                        if($scope.isfinished==="未完成"){
                           if( r==="未完成"){
                               formHistory.push(data)
                           }
                        }else{
                            if( r!=="未完成"){
                                formHistory.push(data)
                            }
                        }
                    }else
                    {
                           formHistory.push(data);
                    }
                })

            });
            $scope.formHistory=formHistory;

        });*/


    }

    function getSuper(id,callback){
        var superQuery={superProcessInstanceId:id};
        var superEngin=[];
        EngineApi.gethistoryProcessList().getHistoryList(superQuery,function(superreslist){

            if(superreslist.length>0){
              //  console.log("2222");
                //有子流程
                // data.superEngin=superres;

                for (var j = 0, superres; !!(superres = superreslist[j]); j++) {
                    var superdata = {};
                    superdata.deleteReason = superres.deleteReason;
                    if(superres.startUserId) {
                        superdata.username = superres.startUserId;
                    }
                    superdata.startTime = superres.startTime;
                    superdata.endTime = superres.endTime;
                    superdata.processDefinitionId = superres.processDefinitionId;
                    superdata.processInstanceId = superres.id;

                    superEngin.push(superdata)
                }

            }

        });
        callback(superEngin);
    }



  }]);
myapp.controller("historyTaskController",['$scope','$q','EngineApi','$location','Forms','BasicService','$filter','$http','$resource','Notifications','User',function($scope,$q,EngineApi,$location,Forms,BasicService,$filter,$http,$resource,Notifications,User){
    var today=new Date();
    var yesterday=today.getTime()-1000*60*60*24;
    var lastday=today.getTime()+1000*60*60*24;
    var currentday=$filter('date')(lastday,'yyyy-MM-dd');
    $scope.startTime=$filter('date')(yesterday,'yyyy-MM-dd');
    $scope.endTime=$filter('date')(yesterday,'yyyy-MM-dd');

    $scope.submit = function() {
        var d1 = parseInt(new Date($scope.startTime).getTime() / 1000 / 60 / 60 / 24);
        var d2 = parseInt(new Date($scope.EndTime).getTime() / 1000 / 60 / 60 / 24);
        var days = d2 - d1;
        if (days > 30) {
            Notifications.addError({'status': 'error', 'message': "开始时间间隔太长，请缩短查询时间间隔，最长30天" });
            return;
        }
        if (d1 > d2) {
            Notifications.addError({'status': 'error', 'message': "开始时间不能大于结束时间 "});
            return;
        }
        var queryjson = {};
        var endtime = $filter('date')($scope.endTime, 'yyyy-MM-ddTHH:mm:ss');
        var starttime = $filter('date')($scope.startTime, 'yyyy-MM-ddTHH:mm:ss');
       //queryjson.processDefinitionId = $scope.selectedprocess;
        queryjson.beforeTimestamp = endtime;
        queryjson.afterTimestamp = starttime;
        queryjson.userId ="980589";// User;
        queryjson.sortBy = "timestamp";
        queryjson.sortOrder = "desc";
        queryjson.maxResults = 100;

        var formHistory = [];
        console.log(queryjson);
         EngineApi.getHistoryOperationList().getList(queryjson, function (taskresslist) {
             console.log(taskresslist);
             var delay = $q.defer();
             for (var i = 0, res; !!(res = taskresslist[i]); i++) {
                 getTaskHistory(res.taskId,function(resdata){
                     formHistory.push(resdata)

                     $scope.formHistory = formHistory;
                     console.log($scope.formHistory);

                 })
             }
         //    return delay.promise;
            });
    }

    function getTaskHistory(id,callback){
        var superQuery={taskId:id};

        EngineApi.getHistoryTaskList().getTaskList(superQuery,function(superreslist){
           var res=superreslist[0];
            console.log(res);
            var data = {};
           data.name=res.name;
            data.desciprtion=res.desciprtion;
            data.startTime=res.startTime;
            data.endTime=res.endTime;
            data.pname="";

            callback(data);

        });

    }


}])
    myapp.controller("PngController",['$scope','EngineApi','$routeParams',function($scope,EngineApi,$routeParams){
        $scope.bpmn = { };
        var tasks = null
        var processDefinitionId=$routeParams.processDefinitionId;
        var pid=$routeParams.pid;
        EngineApi.getTasks().query({"processInstanceId":pid}).$promise.then(function(res) {

            tasks=res;

        });
        if(!tasks){
            $scope.isFinish="流程结束";
        }
        console.log( processDefinitionId);
        //taskid
        if($routeParams.taskid){
      //     $scope.taskid=$routeParams.taskid;
        }
        EngineApi.getProcessDefinitions().xml({ id : processDefinitionId }).$promise.then(function (result) {
            console.log("ewwewewe"+processDefinitionId);
            var diagram = $scope.bpmn.diagram,
                xml =result.bpmn20Xml;

            if (diagram) {
                diagram.clear();
            }

            var $diagramEl = $('#diagram');
            var width = $diagramEl.width();

            try {
                diagram = new Bpmn().render(xml, {
                    diagramElement : 'diagram',
                    width: width,
                    height: 400
                });

                $.each(tasks, function(i,val){

                     diagram.annotation(val.taskDefinitionKey).addClasses([ 'bpmn-highlight' ]);
                });


                $scope.bpmn.diagram = diagram;
            }
            catch (up) {
                $diagramEl
                    .html('<div class="alert alert-error diagram-rendering-error">Unable to render process diagram.</div>');
            }
        });

    }])
});