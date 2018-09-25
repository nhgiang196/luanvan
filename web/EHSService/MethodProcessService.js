/**
 * Create by Isaac 08/11/2018
 * Service for MethodProcessService
 */
define([
    'app',
    'angular'
], function(app, angular) {
    app.service('MethodProcessService',['$resource','$q','Auth','$location','$translate', function($resource,$q,Auth,$location,$translate){
        function MethodProcessService(){
            this.GetInfoBasic =$resource('/ehs/waste/MethodProcessController/:operation',{},{
                getList: 
                {
                    method: 'GET',
                        params: {
                            operation: 'GetBasic'
                        },
                        isArray:true
                },
                getById:
                {
                    method:'POST',
                    params :{operation :'FindById'}
                  
                },
                deleteById: {
                    method: 'POST',
                    params: {operation: 'Remove'}
                   
                },  
                updateEntity: {
                    method: 'POST',
                    params: {operation: 'Update'}
                  
                },     
                createEntity: {
                    method: 'POST',
                    params: {operation: 'Create'}
                }, 
                searchEntity: {
                    method: 'GET',
                    params: {
                        operation: 'Search'
                    },
                    isArray :true
                }
            })            
        }
        MethodProcessService.prototype.Search= function(query,callback){
            console.log(query);
            this.GetInfoBasic.searchEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        MethodProcessService.prototype.GetMethod = function(query, callback){
            this.GetInfoBasic.getList(query).$promise.then(function(data){
                callback(data);              
            }, function(ex){
                console.log(ex);
                callback(null, ex);         
            })
        }
        MethodProcessService.prototype.CreateMethod= function(query,callback){
            this.GetInfoBasic.createEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        MethodProcessService.prototype.DeleteByMethodID= function(query,callback){
            console.log(query);
            this.GetInfoBasic.deleteById(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        MethodProcessService.prototype.FindByID= function(query,callback){
            console.log(query);
            this.GetInfoBasic.getById(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);

            })
        }
        MethodProcessService.prototype.UpdateMethod= function(query,callback){
            console.log(query);
            this.GetInfoBasic.updateEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        return new MethodProcessService();
    }]);
});