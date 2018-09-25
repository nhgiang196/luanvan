/**
 * Create by Isaac 08/11/2018
 * Service for HDDCService
 */
define([
    'app',
    'angular'
], function (app, angular) {
    app.service('HDDCService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function HDDCService() {
            this.GetInfoBasic = $resource('/ehs/waste/VoucherController/:operation', {}, {
                getList:
                {
                    method: 'GET',
                    params: {
                        operation: 'GetAll'
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
                getDepartments: {
                    method: 'GET',
                    params: { operation: 'GetDepartments' },
                    isArray: true
                },
                getDetail: {
                    method: 'GET',
                    params: { operation: 'ReportVoucherDetail' },
                    isArray: true
                },
                searchVoucher: {
                    method: 'GET',
                    params: { operation: 'Search' }
                    //isArray: true
                }   
            })
        }
        HDDCService.prototype.Search = function (query, callback) {
            this.GetInfoBasic.searchVoucher(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }

        HDDCService.prototype.GetVoucher = function (query, callback) {
            this.GetInfoBasic.getList(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.GetVoucherDetail = function (query, callback) {
            this.GetInfoBasic.getDetail(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.GetDepartment = function (query, callback) {
            this.GetInfoBasic.getDepartments(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.CreateVoucher = function (query, callback) {
            this.GetInfoBasic.createEntity(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.DeleteByVoucherID = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.deleteById(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.FindByID = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.getById(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.UpdateVoucher = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.updateEntity(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.GetOnwerComp = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.getOnwerComp(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        HDDCService.prototype.GetProcessComp = function (query, callback) {
            console.log(query);
            this.GetInfoBasic.getProcessComp(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        return new HDDCService();
    }]);

});