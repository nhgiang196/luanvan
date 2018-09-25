/**
 * Create by Isaac 08/11/2018
 * Service for WasteItem
 */

define([
    'app',
    'angular'
], function (app, angular) {
    app.service('WasteItemService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function WasteItemService() {
            this.GetInfoBasic = $resource('/ehs/waste/WasteItemController/:operation', {}, {
                getList:
                {
                    method: 'GET',
                    params: {
                        operation: 'GetBasic'
                    },
                    isArray: true
                },
                getById:
                {
                    method: 'POST',
                    params: { operation: 'FindById' }

                },
                deleteById: {
                    method: 'POST',
                    params: { operation: 'Remove' }

                },
                updateEntity: {
                    method: 'POST',
                    params: { operation: 'Update' }

                },
                createEntity: {
                    method: 'POST',
                    params: { operation: 'Create' }
                },
                getWateItem:{
                    method: 'GET',
                    params: {
                        operation: 'GetWasteItem'
                    },
                    isArray: true
                },
                searchWasteItem: {
                    method: 'GET',
                    params: {
                        operation: 'Search'
                    },
                    isArray :true
                }

            })
        }


        WasteItemService.prototype.Search = function (query,callback) {
            console.log(query);
            this.GetInfoBasic.searchWasteItem(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.GetWasteItem = function (query,callback) {
            this.GetInfoBasic.getList(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.GetWasteItemLang = function (query,callback) {
            this.GetInfoBasic.getWateItem(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.CreateWasteItem = function (query, callback) {
            this.GetInfoBasic.createEntity(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.DeleteByWasteItemID = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.deleteById(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.FindByID = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.getById(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        WasteItemService.prototype.UpdateWasteItem = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.updateEntity(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }

        return new WasteItemService();
    }]);

});