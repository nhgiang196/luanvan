
define([
    'app',
    'angular'
], function (app, angular) {
    app.service('HDDCService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function HDDCService() {
            this.GetInfoBasic = $resource('/ths/HDDCController/:operation', {}, {
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

        HDDCService.prototype.Search = function (query, callback) {
            this.GetInfoBasic.search(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.Create = function (query, callback) {
            this.GetInfoBasic.create(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.Update = function (query, callback) {
            this.GetInfoBasic.update(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.Delete = function (query, callback) {
            this.GetInfoBasic.delete(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.FindByID = function (query, callback) {
            this.GetInfoBasic.findbyid(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        return new HDDCService();
    }]);

});