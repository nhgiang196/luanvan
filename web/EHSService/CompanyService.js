/**
 * Create by Isaac 08/11/2018
 * Service for CompanyService
 */
define([
    'app',
    'angular'
], function(app, angular) {
    app.service('CompanyService',['$resource','$q','Auth','$location','$translate', function($resource,$q,Auth,$location,$translate){
        function CompanyService(){
            this.GetInfoBasic =$resource('/ehs/waste/CompanyController/:operation',{},{
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
       
        CompanyService.prototype.GetCompany = function(callback){
            this.GetInfoBasic.getList().$promise.then(function(data){
                callback(data);              
            }, function(ex){
                console.log(ex);
                callback(null, ex);         
            })
        }
        CompanyService.prototype.Search= function(query,callback){
            console.log(query);
            this.GetInfoBasic.searchEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        CompanyService.prototype.CreateCompany= function(query,callback){
            this.GetInfoBasic.createEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        CompanyService.prototype.DeleteByCompanyID= function(query,callback){
            console.log(query);
            this.GetInfoBasic.deleteById(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        CompanyService.prototype.FindByID= function(query,callback){
            console.log(query);
            this.GetInfoBasic.getById(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
        CompanyService.prototype.UpdateCompany= function(query,callback){
            console.log(query);
            this.GetInfoBasic.updateEntity(query).$promise.then(function(data){
                callback(data);
            }, function(ex){
                console.log(ex);
                callback(null,ex);            
            })
        }
     
        return new CompanyService();
    }]);
    
});