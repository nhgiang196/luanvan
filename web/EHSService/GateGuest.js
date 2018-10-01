
define( ['app','angular'],function(app,angular){
    app.service("GateGuest",[ '$resource','$q','Auth','$location','$translate', function($resource,$q,Auth,$location,$translate) {
        function GateGuest(){
            this.getGuestBasic= $resource("/ehs/gate/Guest/:operation",{},{
                getGuestType:{method:'GET', params : {operation: "GetGuestTypes" },isArray:true},  //访客类型
                getGuestRegions:{method:'GET', params : {operation: "GetRegions" },isArray:true},  //造访区域
                getGuest:{method:'GET', params : {operation: "GetGuestByVoucherID" },isArray:true},//单据号获得单据
                getGuestsList:{method:'GET', params : {operation: "GetGuests" },isArray:false},//条件获得单据列表
                getNameByEmployeeID:{method:'GET', params : {operation: "EmployeeName" },isArray:true}, //工号得到员工姓名
                saveGuest:{method: 'POST',params:{operation:"SaveGuestInfo"}},//保存单据
                saveGuestStatus:{method: 'POST',params:{operation:"SaveGuestStatus"}},//修改状态
                deleteGuest:{method:'DELETE',params:{operation:"DeleteGuests"}},//
                getEmail: {method:'GET', params:{operation:"getEmailbyUserID" },isArray:true},
                getIDByName:{method:'GET',params:{operation:"EmployeeInfo"},isArray:true},//根据姓名得到员工信息
                getGuestInfo:{method:'GET', params:{operation:"getGuestInfo" },isArray:true},
                checkUserBelongDyeing:{method:'GET', params:{operation:"checkUserBelongDyeing" },isArray:true}

            });


            this.saveGuestinfo= $resource("/ehs/gate/Guest/SaveGuestInfo",{},{
                save:{method: 'POST'}//保存单据
            });

            this.getGateCheckers= $resource('/ehs/gate/Checker/:operation', {}, {
                getCheckers: {method: 'GET',  params:{operation:"GetCheckersByLevel"},isArray:true},
                isWorkDay:{method:'GET',params:{operation:"IsWorkDay"}},
                getCheckerByKind:{method:'GET',params:{operation:"GetCheckerByKind"},isArray:true}//得到经办人，如安环的承揽商  、总务的
            });

            this.getGateGuestPID = $resource("/gate/GateGuest/PID",{
                get:{method:'GET'}
            });

            this.getqueryStatus = $resource("/ehs/gate/Checker/GateQueryStatus", {}, {
                get:{method:'GET',isArray:true}
            });
            this.getEmailbyUserID = $resource("/ehs/gate/Guest/:operation",{},{
                get: {method:'GET', params:{operation:"getEmailbyUserID" },isArray:true}
            });

        }
        GateGuest.prototype.GetQueryStatus=function(){
            return this.getqueryStatus;
        };

        GateGuest.prototype.GuestBasic = function(){
            return this.getGuestBasic;
        };
        GateGuest.prototype.GetGateCheckers = function(){
            return this.getGateCheckers;
        };
        GateGuest.prototype.GetGateGuestPID = function(){
            return this.getGateGuestPID
        };
        GateGuest.prototype.SaveGuest=function(){
            return this.saveGuestinfo;
        };
        GateGuest.prototype.GetGateCheckerLeaders=function(query,callback){
            this.getGateCheckers.getCheckers(query).$promise.then(function (checkres) {
                if (checkres.length <= 0) {

                    callback([],"It 's not Get  Checkers")
                } else {
                    callback(checkres,"")

                }
            })
        }
        GateGuest.prototype.GetGateCheckerByKind= function(kind,callback){
            this.getGateCheckers.getCheckerByKind({kind:kind}).$promise.then(function (checkres) {
                if (checkres.length <= 0) {

                    callback([],"It 's not Get EHS Checker")
                } else {
                    console.log('jdkfjlkgjsf: '+checkres[0].Person)
                    //callback(checkres[0].Person,"")

                }
            })
        }
        GateGuest.prototype.GetCheckList=function(){
          return  [{"name": $translate.instant('agree'), "value": "YES"}, {"name": $translate.instant('notAgree'), "value": "NO"}];
        };

        return new GateGuest();

    }])


});
