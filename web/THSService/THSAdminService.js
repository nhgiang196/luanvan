/**
 *
 * Service for THSAdminService
 */
define([
    'app',
    'angular'
], function (app, angular) {
    app.service('THSAdminService', ['$resource', '$q', 'Auth', '$location', '$translate', function ($resource, $q, Auth, $location, $translate) {
        function THSAdminService() {
            this.GetInfoBasic = $resource('/ths/THSAdminController/:operation', {}, {
                bomon:
                {
                    method: 'POST',
                    params: {
                        operation: 'BoMon'
                    }
                },
                chuyennganh: {
                    method: 'POST',
                    params: { operation: 'ChuyenNganh' }
                },
                nienkhoa: {
                    method: 'POST',
                    params: { operation: 'NienKhoa' },

                },
                linhvucchuyenmon: {
                    method: 'POST',
                    params: { operation: 'LinhVucChuyenMon' },
                }, 
                donvingoai: {
                    method: 'POST',
                    params: { operation: 'DonViNgoai' },
                },
                getall: {
                    method: 'GET',
                    params: { operation: 'GetAll' },
                    isArray: true
                },
                getbasic: {
                    method: 'GET',
                    params: { operation: 'GetBasic' },
                    isArray: true
                },
            })
        }
        THSAdminService.prototype.GetBasic = function (query, callback) {
            this.GetInfoBasic.getbasic(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.GetAll = function (query, callback) {
            this.GetInfoBasic.getall(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.cudDonViNgoai = function (query, callback) {
            this.GetInfoBasic.donvingoai(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.cudBoMon = function (query, callback) {
            this.GetInfoBasic.bomon(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.cudChuyenMon = function (query, callback) {
            this.GetInfoBasic.linhvucchuyenmon(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.cudNienKhoa = function (query, callback) {
            this.GetInfoBasic.nienkhoa(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        THSAdminService.prototype.cudChuyenNganh = function (query, callback) {
            this.GetInfoBasic.chuyennganh(query).$promise.then(function (data) {
                callback(data);
            }, function (ex) {
                console.log(ex);
                callback(null, ex);
            })
        }
        return new THSAdminService();
    }]);

});