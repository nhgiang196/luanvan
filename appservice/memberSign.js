/**
 *  人事信息的API
 */
module.exports = function(app,request,basicService,config) {
    var log = require('log4js').getLogger("memberSign")
 //获取部门所有人员
    app.get('/ehs/department/allmember/:department', function (req, res) {
        var url = config.hrrest + '/api/HSSE/GetEmployeesByDept/' + req.params.department;
        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                    res.json([]);
                } else {
                    if (response.statusCode == 200) {
                        var body = JSON.parse(body);//流程的key
                        res.json(body);
                    } else {
                        log.error(response.statusCode);
                        //logs.logger.error(req.params.department+'error获取部门人员信息失败!' + body);
                        //res.json({'message':"error获取部门人员信息失败!"+body});
                        res.json([]);
                    }
                }

            });
    })

//获取部门
    app.get('/ehs/department', function (req, res) {
console.log(config.hrrest);
        var url = config.hrrest + 'api/HSSE/GetDepartments?userid='+ req.query.userid+"&ctype="+req.query.ctype;
        console.log(url);
        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                    res.json([]);
                } else {
                    if (response.statusCode == 200) {
                        var body = JSON.parse(body);//流程的key
                        res.json(body);
                    } else {
                        log.error(response.statusCode);
                        res.json([]);
                    }
                }
            });

    })

//获取部门领导
    app.get('/ehs/leader/:company/:department', function (req, res) {
        console.log(req.params.department);
        //res.json([{'id':'000000','name':'小李'}]);
        var url = config.hrrest + 'api/HSSE/GetCheckers/' + req.params.department;
        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                   // logs.logger.error( req.params.department+'error获取部门领导信息失败!' + body);
                    //res.json({'message':"22error获取部门领导信息失败!"+body});
                    res.json([]);
                } else {
                    console.log(response.statusCode);
                    if (response.statusCode == 200 && !body.message) {
                        var body = JSON.parse(body);//流程的key
                        res.json(body);
                    } else {
                       // logs.logger.error(req.params.department+'获取部门领导信息失败!' + body);
                        res.json([]);
                    }
                }
            });
    })



//获得员工的名称
    app.get('/ehs/employeeInfo/:userid', function (req, res) {
        var url = config.hrrest + 'api/HSSE/GetEmployeeInfo/' + req.params.userid;

        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                    // logs.logger.error('error获取用户失败!' +  body);
                   // res.json({Name: req.params.userid});
                    res.send(500,error);
                } else {
                    if (response.statusCode == 200 && !body.message) {
                        var body = JSON.parse(body);//
                        res.json(body);
                    } else {
                        //   logs.logger.error('error获取用户失败!' +  body);
                    //    res.json({Name: req.params.userid});
                        res.send(500,"error获取用户失败");
                    }
                }
            });


    });
    //获取处理记录信息
    app.get('/ehs/GetProcessLogs/:id/:cId?', function (req, res) {
        console.log("获取处理记录信息");
        var url;
        if (req.params.cId === undefined) {
            url = config.hrrest + 'api/HSSE/GetProcessLogs/' + req.params.id
        } else {
            url = config.hrrest + 'api/HSSE/GetProcessLogs/' + req.params.id + '/' + req.params.cId;
        }

        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                   // logs.logger.error('error获取处理信息失败!' + body);
                    res.json([]);
                } else {
                    console.log("获取处理记录信息200");
                    if (response.statusCode == 200) {
                        var body = JSON.parse(body);
                        res.json(body);
                    } else {
                       // logs.logger.error('error获取处理信息失败!' + body);
                        res.json([]);
                    }
                }
            });
        return;

    })
  //  /api/HSSE/CheckTCode?username=gilpin&tcode=ContractorInspectProcess


    //是否有权限
    app.get('/ehs/api/HSSE/CheckTCode/:userid/:tcode',function(req,res){
        basicService.getAuth(request,config.hrrest,req.params.userid , req.params.tcode,function(bodyres){
            console.log("------");;
            console.log(bodyres);
                res.json(bodyres);
            })


    })
}