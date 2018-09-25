/**
 * Created by wangyanyan on 2016-07-25.
 */

module.exports = function(app,request,config,express) {
    var log = require('log4js').getLogger("bpm");
    var basicService = require('./../routes/basicRoute');
    basicService.DBSQLConnection(config);
    var http = require('http');
    app.get('/ehs/form/test',function(req,res){
        var data = {};
        data.key = "test";
        data.keyname = "11111";
        data.processDefinitionId ="processDefinitionId";
        data.processInstanceId = "processInstanceId";
        data.executionId = "";
        data.taskid = "";
        data.username = req.session['username'];
        data.description = "www";
        data.taskDefinitionKey = "start";
        data.ip = req.connection.remoteAddress;
        data.variable = JSON.stringify([]);
        basicService.saveForms(data, function (_data) {
            console.log("saveForms ok");
            res.json({'message': "OK"});
        });
    })
    app.post('/ehs/Dictionary/save',express.bodyParser(),basicService.saveDictionary );
    app.post('/ehs/Dictionary/get',express.bodyParser(),basicService.getDictionary);
    app.post('/ehs/Dictionary/getJson',express.bodyParser(),basicService.getDictionaryJson);
    app.post('/ehs/Dictionary/delete',express.bodyParser(),basicService.deleteDictionary);

    //查询这个用户还代理哪些人的工作
    app.get('/ehs/bpm/proxyUser', basicService.QueryproxyUser);
    //查需userid有被谁代理
    app.get('/ehs/bpm/MyproxyUser', basicService.MyQueryproxyUser);
    app.get('/ehs/bpm/ProxyUserByName',basicService.QueryproxyUserByName);//获取当前任务的代理人
    app.delete('/ehs/bpm/proxyUser',basicService.DeleteProxyUser);//删除代理人
    app.post('/ehs/bpm/proxyUser', express.bodyParser(), basicService.AddProxyUser);//设置代理人
    app.put('/ehs/bpm/proxyUser',basicService.QueryUserbyId)
    app.get('/ehs/employeeInfo/:userid', function (req, res) {
      //  res.json({Name: req.params.userid});

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
                        res.send(500,"error get username");
                    }
                }
            });

    });

    //ths check tcode
    app.get('/bpm/CheckTCode/:userid/:tcode', function(req,res){
        var tcode=req.params.tcode;
            if ( req.session['username'] && tcode) {
                var url = config.hrrest + 'api/ths/THSAuthLogin/CheckTCode?username=' + req.session['username'] + '&tcode=' + tcode;
            console.log(url);
                request({ method: 'GET', uri: url  }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        log.error(err);
                        res.send(500, err);

                    } else {
                        if (response.statusCode == 200) {
                            if (body == "true") {
                                console.log(body);
                                res.json({IsSuccess: true});
                            } else {
                                res.json({IsSuccess: null});
                            }
                        } else {
                            log.error('error getAuth!' + response.statusCode);
                            res.json({IsSuccess: null});
                        }
                    }
                });


            }else {
                res.send(500, "userid is error");
            }
    });
    app.get('/ehs/RefreshUser',function(req,res){
      var  url = config.hrrest + 'api/HSSE/RefreshUser';
        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    log.error(error);
                    res.send(500,"error");
                } else {
                    res.send(response.statusCode );
                }
            });
    })
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
                    log.error(error);

                    res.json([]);
                } else {

                    if (response.statusCode == 200) {
                        var body = JSON.parse(body);
                        res.json(body);
                    } else {
                        log.error(response.statusCode + body);
                        res.json([]);
                    }
                }
            });
        return;

    })

// /bpm/start/:id/:version
    // app.get('/bpm/start/:id',function(req,res){
    //     //mule get definitionID
    //     //get start form key
    //     //是否有权限
    //     var tcode=  req.params.id.split(":")[0];
    //     console.log(tcode);
    //     console.log(req.session['username']);
    //     var para={id:req.params.id};
    //     basicService.getAuth (request,config.hrrest,req.session['username'],tcode,function(bores){
    //   //  basicService.getAuth(request,req.session['username'], tcode,function(bores){
    //         console.log(bores);
    //         if(bores.IsSuccess){
    //             //------------------------
    //             basicService.getStartForm(config.bpmrest,para,function(formkey,message){
    //                 if(message){
    //                     res.json({"message":message});
    //                 }else{
    //                     if(formkey){
    //                         formkey=config.form+JSON.parse(formkey).form+".html";
    //                         res.json({"formkey":formkey,"definitionID":req.params.id});
    //                     }else{
    //                         //没有表单启动流程
    //                         res.json({"formkey":null,"definitionID":req.params.id});
    //                     }
    //                 }
    //             });
    //             //--------
    //         }else{

    //             res.json({"message":"No permission to access, please apply"});
    //         }
    //     })

    //     //   res.json({"formkey":"http://localhost:843/forms/testV2/start.html","definitionID":"testV2:1:0cb28059-a4fe-11e3-acd9-0c84dc2d23b0"});
    // });

    //启动开始流程
    // app.post('/bpm/startDefinition/:id/:operation', express.bodyParser(), function (req, res) {
    //     var bpm_businessKey=req.body.businessKey||"";
    //     var variables={"variables":{},"businessKey":bpm_businessKey},
    //         formdata=req.body.formdata,
    //         historyfield=req.body.historydata,
    //         v = variables.variables;
    //     var historyArray = [];
    //     for (var key in historyfield) {
    //         historyArray.push({"name": key, "value": historyfield[key]});

    //     }
    //     //是否要checkForm
    //     console.log("-----启动开始流程" + req.params.id + "-------");
    //     console.log(req.body.historydata);
    //     console.log(config.bpmhost);
    //     console.log(historyArray);
    //     for (var key in formdata) {
    //             v[key] = {};
    //             //    console.log( formdata[key]);
    //             v[key].value = formdata[key];
    //             if (typeof v[key].value === "string") {
    //                 v[key].type = "String";
    //             }
    //     }
    //      v["initiator"] = {value: req.session['username'], type: "String"};
    //      var auth = 'Basic ' + new Buffer(req.session['username'] + ':' + req.session['password']).toString('base64');
    //      var contents = JSON.stringify(variables);
    //      var options = {
    //             host: config.bpmhost,
    //             port: config.bpmprot,
    //             path: '/default/bpm-rest-api/process-definition/' + req.params.id + '/start',
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json; charset=utf-8',
    //                 'Authorization': auth
    //             }
    //         };
    //         console.log(contents);
    //         var r = http.request(options, function (response) {
    //             console.log('STATUS: ' + response.statusCode);
    //             if (response.statusCode === 200) {
    //                 response.setEncoding('UTF-8');
    //                 response.on('data', function (data) {
    //                     console.log(data);
    //                     // 保存数据
    //                     var jsonData = JSON.parse(data),
    //                         pid = jsonData.id,
    //                         definitionId = req.params.id,
    //                         url = null
    //                     //得到key
    //                     basicService.getProcessKey(config.bpmrest,definitionId, function (body, message) {
    //                         var data = {};
    //                         data.key = body.key;
    //                         data.keyname = body.name;
    //                         data.processDefinitionId = body.id;
    //                         data.processInstanceId = pid;
    //                         data.executionId = "";
    //                         data.taskid = "";
    //                         data.username = req.session['username'];
    //                         data.description = body.description;
    //                         data.taskDefinitionKey = "start";
    //                         data.ip = req.connection.remoteAddress;
    //                         data.variable = JSON.stringify(formdata);
    //                         data.historyField = historyArray;
    //                         basicService.saveForms(data, function (_data) {

    //                         });
    //                     });
    //                     //成功转向的地址
    //                     if (pid) {
    //                         url = definitionId + "/complete/" + pid;
    //                         res.json({'result': data, 'url': url});
    //                     } else {
    //                         res.json({'message': "发送错误没找到流程定义ID"});
    //                         return;
    //                     }
    //                 });
    //             } else {
    //                 response.setEncoding('UTF-8');
    //                 response.on('data', function (data) {
    //                     res.json({'message': "启动流程错误" + data});

    //                 });
    //                 return;
    //             }

    //         });

    //         req.on('error', function (e) {
    //             log.error('start bpm startDefinition ' + e.message);
    //             res.json({'message': e.message});
    //             return;
    //         });
    //         r.write(contents);
    //         r.end();
    // });

//get taskform
    // app.get('/bpm/task/:id', function (req, res) {
    //     console.log(req.params.id);
    //     //得到Variables

    //     var taskId = req.params.id;
    //     basicService.getVariables(config.bpmrest,taskId, function (variables, pid, message) {
    //         //console.log(variables);
    //         if (variables) {
    //             //转换变量
    //             var newVariables = basicService.setVariables(variables);
    //             //获得表单
    //             basicService.getTaskform(config.bpmrest,taskId, function (formkey, message) {
    //                 try {
    //                     var formkey = JSON.parse(formkey);
    //                     formkey = config.form + formkey.form + ".html";
    //                     log.debug(formkey);
    //                     log.debug(newVariables);
    //                     res.json({"formkey": formkey, "taskid": req.params.id, "pid": pid, data: newVariables});
    //                 } catch (err) {
    //                     log.error(err);
    //                     res.json({"message": "bpm form format is error;" + err.stack});
    //                 }
    //             })

    //         } else {
    //             res.json({"message": message})
    //         }
    //     });
    // });

//sumbit form
    // app.post('/bpm/task/:id/:operation', express.bodyParser(), function (req, res) {
    //     try {
    //         //给 variables 加变量的前缀
    //         var taskId = req.params.id,
    //             variables = {"variables": {}},
    //             formdata = req.body.formdata,
    //             v = variables.variables;
    //         var historyfield = req.body.historydata;
    //         var historyArray = [];
    //         for (var key in historyfield) {
    //             historyArray.push({"name": key, "value": historyfield[key]});

    //         }

    //         console.log("do task");
    //         //得到task 信息
    //         basicService.getProcessTaskKey(config.bpmrest,taskId, function (body, message) {
    //                 var data = {};
    //             console.log(body);
    //             if(!body){
    //                 res.json({'message': "this task was done"});
    //                 return;
    //             }
    //             if( !body.processDefinitionId){
    //                 res.json({'processDefinitionId': "Get processDefinitionId have a question"});
    //             }
    //                 data.key = body.processDefinitionId.split(":")[0];
    //                 data.processDefinitionId = body.processDefinitionId;
    //                 data.processInstanceId = body.processInstanceId;
    //                 data.executionId = body.executionId;
    //                 data.taskid = body.id;
    //                 data.username = req.session['username'];
    //                 data.description = body.description;
    //                 data.taskDefinitionKey = body.taskDefinitionKey;
    //                 data.ip = req.connection.remoteAddress;
    //                 data.variable = JSON.stringify(formdata);
    //                 data.historyField = historyArray;
    //                 data.name = body.name;
    //                 data.status = 0;
    //             if(req.session['username']) {
    //                 basicService.saveForms(data, function (_data) {
    //                     if (_data.IsSuccess == true) {
    //                         for (var key in formdata) {
    //                             v[key] = {};
    //                             v[key].value = formdata[key];
    //                             if (typeof v[key].value === "string") {
    //                                 v[key].type = "String";
    //                             }
    //                         }

    //                         var contents = JSON.stringify(variables);
    //                         var auth = 'Basic ' + new Buffer(req.session['username'] + ':' + req.session['password']).toString('base64');
    //                         console.log(auth);
    //                         console.log(contents);
    //                         var options = {
    //                             host: config.bpmhost,
    //                             port: config.bpmprot,
    //                             path: '/default/bpm-rest-api/task/' + taskId + '/complete',
    //                             method: 'POST',
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                                 'Authorization': auth
    //                             }
    //                         };
    //                         var r = http.request(options, function (response) {
    //                             response.setEncoding('UTF-8');
    //                             if (response.statusCode == "204") {
    //                                 var url = null;
    //                                 //成功转向的地址 taskid/complete/:pid
    //                                 url = taskId + "/complete/"
    //                                 console.log("---204----");
    //                                 res.json({'result': {taskid: taskId}, url: url});

    //                             } else {
    //                                 //delete form data
    //                                 basicService.removeForms(data);
    //                                 response.setEncoding('UTF-8');
    //                                 response.on('data', function (data) {
    //                                     log.error('submit taskid: ' + response.statusCode + data);
    //                                     res.json({'result': null, 'message': response.statusCode + data});
    //                                 });
    //                                 return;
    //                             }
    //                         });
    //                         req.on('error', function (e) {
    //                             log.error('error: ' + e.message);
    //                             res.json({'message': e.message});
    //                         });
    //                         r.write(contents);
    //                         r.end();
    //                     } else {
    //                         log.error('save from failed"');
    //                         res.json({'message': "save from failed"});
    //                     }
    //                 });
    //             }else{
    //                 res.json({'message': "error :it's get user name,please F5"});
    //             }
    //             });

    //     } catch (err) {
    //         res.json({'message': "error" + err.stack});
    //     }

    // });

    //设置代理人

}