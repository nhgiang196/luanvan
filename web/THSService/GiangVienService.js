/**
 * Create by Jang
 * Service for GiangVienService
 */
define([
    'app',
    'angular'
], function (app, angular) {
    app.service('GiangVienService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function GiangVienService() {
            this.GetInfoBasic = $resource('/ths/GiangVienController/:operation', {}, {
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

        GiangVienService.prototype.Search = function (query, callback) {
            this.GetInfoBasic.search(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        GiangVienService.prototype.Create = function (query, callback) {
            this.GetInfoBasic.create(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        GiangVienService.prototype.Update = function (query, callback) {
            this.GetInfoBasic.update(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        GiangVienService.prototype.Delete = function (query, callback) {
            this.GetInfoBasic.delete(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        GiangVienService.prototype.FindByID = function (query, callback) {
            this.GetInfoBasic.findbyid(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        return new GiangVienService();
    }]);

});