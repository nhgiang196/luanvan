/**
 * Created by wangyanyan on 14-3-6.
 */
define( ['myapp'],function(myapp){

    myapp.controller("startListController",['$scope','EngineApi',function($scope,EngineApi){
        var queryObject = { latest : true };
        $scope.processDefinitions =  EngineApi.getProcessDefinitions().query(queryObject);
        var pds = $scope.pds = {};
        EngineApi.getProcessDefinitions().getLastList(function(list){
            console.log(list);
            $.each(list, function(i, value) {
                console.log("----------");
                console.log(value);
                list[i].processDefinitionKey=value.key;
                console.log( list[i].processDefinitionKey);
                pds[list[i].processDefinitionKey] = new Array();
                EngineApi.getProcessDefinitions().getdefkeyList({key:value.key},function(data){
                    pds[list[i].processDefinitionKey] = data;
                    console.log(pds);
                });
            });

        });


    }])

    myapp.controller("workflowController",['$scope','EngineApi','$location',function($scope,EngineApi,$location){

        $scope.btSelect = function(key) {
            console.log(key);
            EngineApi.getKeyId().getkey({"key":key},function(res){
                console.log(res.id);
                ///taskForm/start/:id
                $location.url("/taskForm/start/"+res.id);
            });
        }
    }]);
})