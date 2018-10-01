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
                    method: 'GET',
                    params: {
                        operation: 'BoMon'
                    },
                    isArray: true
                },
                chuyennganh: {
                    method: 'GET',
                    params: { operation: 'ChuyenNganh' }
                },
                nienkhoa: {
                    method: 'GET',
                    params: { operation: 'NienKhoa' },
                    isArray: true
                },
                linhvucchuyenmon: {
                    method: 'GET',
                    params: { operation: 'LinhVucChuyenMon' },
                    isArray: true
                }, 
                donvingoai: {
                    method: 'GET',
                    params: { operation: 'DonViNgoai' },
                    isArray: true
                },
                getall: {
                    method: 'GET',
                    params: { operation: 'GetAll' },
                    isArray: true
                },
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
        THSAdminService.prototype.cudLinhVucChuyenMon = function (query, callback) {
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