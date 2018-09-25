/**
 * Created by wangyanyan on 2014/10/17.
 */

define( ['app','angular'],function(app,angular){
    app.controller("socketIoController",['$scope','$routeParams','$resource','$location','Notifications',function($scope,$routeParams,$resource,$location,Notifications){
        $scope.isConnected=false;
       // $scope.serverTime;

      /*  socket.on('connect',function(){
            $scope.isConnected=true;
            socket.on('timer',function(data){
                $scope.serverTime = data.time;
            });
        });

        socket.on('disconnect',function(){
            $scope.isConnected=false;
        });

        socket.on('error',function(){
            $scope.isConnected=false;
        });

        socket.on('reconnecting',function(){
            $scope.isConnected=false;
        });*/
    }]);
});