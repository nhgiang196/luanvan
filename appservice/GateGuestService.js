
module.exports = function(app,request,config,express) {

    var GateRoute = require('./../routes/GateGuestRoute');
    GateRoute.DBSQLConnection(config);
    app.get('/gate/GateGuest/PID', GateRoute.queryGateGuestPID);
    app.get('/gate/GateGoodsOut/PID', GateRoute.queryGoodsOutPID);
    // app.get('/gate/GateUnjointTruck/PID', GateRoute.queryGateUnjointTruckPID);
    // app.get('/gate/GatejointTruck/PID', GateRoute.queryGateJointTruckPID);
    // app.get('/gate/GatePtaEgTruck/PID', GateRoute.queryGatePtaEgTruckPID);
    //承揽商办卡的信息查询  //身份证号和承揽商找到流程进程
    // app.get('/ehs/contractorQua/queryProcess', GateRoute.getContractorQuaInfoByCard);

    app.get('/ehs/ContractorInfo/PID', GateRoute.getContractorInfoByEmployer);
    app.get('/ehs/ContractorCancel/PID', GateRoute.getContractorCancelByEmployer)
    app.get('/lims/QCGrades/PID', GateRoute.GetQCGrades)
}
