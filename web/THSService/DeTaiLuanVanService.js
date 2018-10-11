/**
 * Create by Isaac 08/11/2018
 * Service for DeTaiLuanVanService
 */
define([
    'app',
    'angular'
], function (app, angular) {
    app.service('DeTaiLuanVanService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function DeTaiLuanVanService() {
            this.GetInfoBasic = $resource('/ths/DeTaiLuanVanController/:operation', {}, {
                search:
                {
                    method: 'GET',
                    params: {
                        operation: 'Search'
                    },
                    isArray: true
                },
                create:
                {
                    method: 'POST',
                    params: {
                        operation: 'Create'
                    },
                },
                update:
                {
                    method: 'POST',
                    params: {
                        operation: 'Update'
                    },
                },
                delete:
                {
                    method: 'POST',
                    params: {
                        operation: 'Remove'
                    },
                },
                findbyid:
                {
                    method: 'POST',
                    params: {
                        operation: 'FindById'
                    },
                    // isArray: true
                },

            })
        }

        DeTaiLuanVanService.prototype.Search = function (query, callback) {
            this.GetInfoBasic.search(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        DeTaiLuanVanService.prototype.Create = function (query, callback) {
            this.GetInfoBasic.create(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        DeTaiLuanVanService.prototype.Update = function (query, callback) {
            this.GetInfoBasic.update(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        DeTaiLuanVanService.prototype.Delete = function (query, callback) {
            this.GetInfoBasic.delete(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        DeTaiLuanVanService.prototype.FindByID = function (query, callback) {
            this.GetInfoBasic.findbyid(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        return new DeTaiLuanVanService();
    }]);

});