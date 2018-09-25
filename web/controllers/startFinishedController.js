/**
 * Created by wangyanyan on 14-3-7.
 */
define( ['myapp','angular'],function(myapp,angular){
    myapp.controller("startFinishedController",['$scope','EngineApi','$routeParams','$timeout','$location'
        ,function($scope,EngineApi,$routeParams,$timeout,$location){
            var processDefinitionId = $scope.processDefinitionId = $routeParams.processDefinitionId;
            console.log("-----startFinishedController------");
            console.log($routeParams.pid);
            var queryObject = { processInstanceId : $routeParams.pid };
            var taskfinished_pid="";
            EngineApi.getProcessInstance().get({superProcessInstance:$routeParams.pid},function(list){
               // console.log("-----");
               // console.log($routeParams.pid);
                if(list.length>0){
                    console.log(list.length);
                    console.log(list[0].id);
                    taskfinished_pid=list[0].id;
                }else{
                    taskfinished_pid=$routeParams.pid;
                }
            //    console.log(taskfinished_pid);
                var queryObject = { processInstanceId :taskfinished_pid };
                $scope.nexttasks = EngineApi.getTasks().query(queryObject)


            });
         //   $scope.nexttasks = EngineApi.getTasks().query(queryObject)
           // console.log( $scope.nexttasks);
         //   $scope.flowImgUrl = "/bpm/api/default/bpm-rest-api/feg-process-instance/processInstance/"+$routeParams.pid+"/png";
       //     var time = $scope.time = 30;
            var url = $scope.url = "/taskForm/todo";
         //   var timeout;
            $scope.goTo = function(){
          //      $timeout.cancel(timeout);
                $location.url(url);
            };
/*
            function start(){
                timeout = $timeout(function() {
                    if ($scope.time > 1) {
                        $scope.time = $scope.time -1;
                        start();
                    } else {
                        $location.url(url);
                    }
                }, 1000);
            }
            start();
            */
        }]);
});