/**
 * Created by Just1n on 2014/7/22.
 */

define( ['myapp','angular','bpmn'],function(myapp,angular,Bpmn){
    myapp.controller("processlogController",['$scope','$http','$compile','$routeParams','$resource','$location','Forms','EngineApi','Notifications','$rootScope','Auth','$anchorScroll',function($scope,$http,$compile,$routeParams,$resource,$location,Forms,EngineApi,Notifications,$rootScope,Auth,$anchorScroll){
        var processId =  $routeParams.id;
        var cProcessId = $routeParams.cId;
        var pid=processId;
        if(cProcessId){
            pid=cProcessId
        }
        EngineApi.getTasks().getList({processInstanceId: pid},function(ress){
            $scope.currentTask = ress;
        })
        EngineApi.getProcessLogs.getList({"id":processId,"cId":cProcessId},function(data){
            if(data.length === 0){
                $scope.processLogs = "";
            }else{
                $scope.processLogs = data;
            }
        });
    }]);
});
