/**
 * Created by wangyanyan on 14-3-27.
 */
 define( ['app','angular'],function(app,angular){
    app.factory('interceptor',['$rootScope', '$q','$location','notifyService',function($rootScope, $q,$location,notifyService){

        return function (promise) {
            var success = function (response) {


                notifyService(response);
                $('#spinner_wait').hide();
                return response;
            };
            var error = function (response) {
                if (response.status === 401) {
                    $location.url('/login');
                }
                $('#spinner_wait').hide();
                notifyService(response);
                return $q.reject(response);
            };

            return promise.then(success, error);
        };

    }]);
     app.factory('notifyService',['$rootScope','$timeout',function($rootScope,$timeout){
         $rootScope.isShowHttpAlter=true;
         $rootScope.httpStatus="";
         $rootScope.httpMessage="";
         $rootScope.httpAlterTime = 10;
         $rootScope.closeHttpAlter = function(){
             $rootScope.isShowHttpAlter = false;
         }

         var stop;

         function start(){

             $timeout.cancel(stop);
             startTime();
         }
         function startTime(){
             stop = $timeout(function() {
                 if ($rootScope.httpAlterTime > 1) {
                     $rootScope.httpAlterTime = $rootScope.httpAlterTime -1;
                     $rootScope.isShowHttpAlter=true;
                 } else {

                     $rootScope.isShowHttpAlter=false;
                 }
             }, 5000);
         }

         return function(response){
             $rootScope.isShowHttpAlter=false;
             if(response.status<300&&response.status>=100){
                 $rootScope.httpAlterTime = 1;
                 $rootScope.httpStatus="success";
                 $rootScope.httperror="";
                 $rootScope.httpMessage="status:"+response.status;
             }
             else{
                 $rootScope.httpAlterTime = 10;
                 $rootScope.httpStatus="danger";
                 $rootScope.httpMessage="status:"+response.status;
                 $rootScope.httperror=response;
             }
             start();
         };
     }])
});