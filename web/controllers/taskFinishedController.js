/**
 * Created by wangyanyan on 14-3-7.
 */
define( ['myapp','angular'],function(myapp,angular){
    myapp.controller("taskCompletedController",['$scope','EngineApi','$routeParams','$timeout','$location'
        ,function($scope,EngineApi,$routeParams,$timeout,$location){

            var taskid = $scope.taskid = $routeParams.taskid;
          //  var time = $scope.time = 10;
            var url = "/taskForm/todo";
         //   var timeout;
            var taskfinished_pid="";

          //  http://demo.feg.cn:9999/default/bpm-rest-api/process-instance?superProcessInstance=0bb74ff8-1613-11e4-9a18-005056b650ba
            EngineApi.getProcessInstance().get({superProcessInstance:$routeParams.pid},function(list){
                console.log("-----");
                console.log($routeParams.pid);
                if(list.length>0){
                    console.log(list.length);
                    console.log(list[0].id);
                    taskfinished_pid=list[0].id;
                }else{
                    taskfinished_pid=$routeParams.pid;
                }
                console.log(taskfinished_pid);
                var queryObject = { processInstanceId :taskfinished_pid };
                $scope.nexttasks = EngineApi.getTasks().query(queryObject)
            });

            $scope.goTo = function(){
               // $timeout.cancel(timeout);
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
        }])
});