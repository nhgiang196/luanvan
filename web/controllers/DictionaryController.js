/**
 * Created by wang.chen on 2016/11/30.
 */
define(['myapp', 'angular'], function (myapp, angular) {
    myapp.controller("DictionaryController", ['$scope', '$http', '$compile', '$routeParams', '$resource', '$location', 'Forms', 'DictionaryApi', 'User', 'Notifications', '$q',
        function ($scope, $http, $compile, $routeParams, $resource, $location, Forms, DictionaryApi, User, Notifications, $q) {

            $scope.query={};
            var opear="ADD";
            $scope.search=function(){
                var query={};
                query.ID=$scope.query.ID||""
                query.CN= $scope.query.CN||"";
                query.StartTime= $scope.query.StartTime||""
                query.EndTime= $scope.query.EndTime||""
                query.Ctype="";
                searchDic(query);
            }
            function searchDic (query){

                DictionaryApi.GetWords().get({record:query}).$promise.then(function(res){
                    $scope.dictionary = res;
                }, function (errormessage) {
                    Notifications.addError({'status': 'error', 'message': errormessage});
                });
            }
            $scope.functionThatReturnsStyle = function(i) {
                var style1 = "color: red";

                var style3 = "color: #000000";
                if(i==0 ){
                    return "color: red";
                }
               else if(i==1 ){
                    return "color: #5bc0de";
                }
                else if(i==2 ){
                    return "color: #000000";
                }


            }

            $scope.ChangeJson=function(lan){
              //  var strs=[];
                var str={};
                for (var i = 0; i <  $scope.dictionary.length; i++) {
                    var value = $scope.dictionary[i][lan];
                    var ID = $scope.dictionary[i]['ID'];
                    str[ID] = value;


                }
                console.log(str);
             /*   DictionaryApi.SavejsonWords().get({lan:lan}).$promise.then(function (res) {

                    Notifications.addError({'status': 'info', 'message': "save success"});

                }, function (errormessage) {
                    Notifications.addError({'status': 'error', 'message': errormessage});
                });*/
                $scope.str=str;
            }
            $scope.addNewWord = function (i) {
              console.log(  $scope.words.ID)
                $scope.words.Publish=i;
                DictionaryApi.SaveNewWord().save({opear:opear,record:$scope.words}).$promise.then(function (res) {
                    $scope.words = {}
                    Notifications.addError({'status': 'info', 'message': "save success"});

                }, function (errormessage) {
                    Notifications.addError({'status': 'error', 'message': errormessage});
                });
            };
            $scope.add = function(){
                var opear="ADD";
                $scope.action="ADD";
               $scope.words={};
                $('#myModal').modal('show');
            };
            $scope.close = function(){
                $('#myModal').modal('hide');
            };
            $scope.updateWord=function(n){
                if(n) {
                    var query = {};
                    query.ID = n;
                    query.CN = $scope.query.CN || "",
                    query.Ctype="Update";
                    $scope.action= query.Ctype;
                    DictionaryApi.GetWords().get({record: query}).$promise.then(function (res) {
                        $scope.words = {};
                        $scope.words = res[0];
                        opear = "UPDATE";
                        $('#myModal').modal('show');
                    }, function (errormessage) {
                        Notifications.addError({'status': 'error', 'message': errormessage});
                    });

                }

            };
            $scope.deleteWord=function(n){
                if(n) {
                    DictionaryApi.DeleteWords().delete({ID: n}).$promise.then(function (res) {
                        Notifications.addError({'status': 'info', 'message': "删除成功"});
                    }, function (errormessage) {
                        Notifications.addError({'status': 'error', 'message': errormessage});
                    });
                }
            }
        }]);
});
