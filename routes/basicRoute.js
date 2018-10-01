
var log = require('log4js').getLogger("basicRoute");
var sworm = require('sworm');
// var FormsProject = require('./../models/forms.js');

var request = require('request');
var async=require('async');
var conn="";
exports.DBSQLConnection=function(config){
    conn=  {
        driver: 'mssql',
        config: {
            user: config.dbuser,
            password: config.dbpassword,
            server:config.datasource,
            database: config.database
        }
    };
}
exports.deleteDictionary  = function (req, res) {
    sworm.db(conn).then(function (db) {
        db.query('delete from  Dictionary where ID = @ID',
            {ID: req.body.ID})
            .then(function (result) {
                console.log(result);
                res.send(200, result);
            })
            .catch(function (error) {
                res.send(500, error);
            })
            .finally(function () {
                db.close();
            });
    })
};

exports.getDictionaryJson=function(req,res){
    var lan= req.body.lan;
    if(lan) {
        console.log(lan);
        sworm.db(conn).then(function (db) {
            db.query('exec B_Dictionary_JSON @Language',
                {Language: lan})
                .then(function (result) {
                    var str={};
                    for (var i = 0; i <  result.length; i++) {
                        var value = result[i][lan];
                        var ID = result[i]['ID'];
                        str[ID] = value;

                    }

                    var outputFilename = './test.txt';
                    console.log(outputFilename);

                    fs.writeFile(outputFilename, JSON.stringify(str), function (err) {
                        if (err) {
                            console.log(err)
                            res.send(500, err);
                        } else {

                            res.send(200, "JSON saved to " + outputFilename);
                        }
                    });


                })
                .catch(function (error) {
                    res.send(500, error);
                })
                .finally(function () {
                    db.close();
                });
        })
    }else{
        res.send(500, "language is null");
    }
}
exports.getDictionary = function (req, res) {
    var record = req.body.record;
    console.log(record);
    if (record) {
        sworm.db(conn).then(function (db) {
            db.query('exec B_Dictionary @ID,@CN,@Ctype,@B,@E',
                {ID: record.ID,CN:record.CN,Ctype:record.Ctype,B:record.StartTime,E:record.EndTime})
                .then(function (result) {
                    res.send(200, result);
                })
                .catch(function (error) {
                    res.send(500, error);
                })
                .finally(function () {
                    db.close();
                });
        })
    }
};
//保存语言的文本
exports.saveDictionary = function (req, res) {
    var record = req.body.record;
    var opear =req.body.opear;
    sworm.db(conn).then(function (db) {

        if (opear=="UPDATE") {
            opear.saved = true;
            console.log("UPDATE");
            console.log(record);
            var Dictionary = db.model({table: 'Dictionary', id: ['ID']});
            var postion = Dictionary(record, {saved:true}).save({force: true}).then(function () {
                res.send(200);
            })
             .catch(function (error) {
                    res.send(500, error);
            })
             .finally(function () {
                    db.close();
             });
        } else {

            //是否已经存在
            CheckDictionary(record.CN,  function (count,msg) {
                if (count > 0) {
                    if(msg){
                        res.send(500,msg);
                    }else {
                        res.send(500, "there is the Chinese name  ,Don't need to repeat the establishment");
                    }
                } else {
                    var Dictionary = db.model({table: 'Dictionary', id: ['ID']});
                    record.Stamp=new Date();
                    var postion = Dictionary(record, {saved:false}).save({force: true}).then(function () {
                        res.send(200)
                    })
                        .catch(function (error) {
                            res.send(500, error)
                        })
                        .finally(function () {
                            db.close();
                        });
                }

            })

        }


    });
};
//核查这个字典是否存在
function CheckDictionary(CN,callback){
    sworm.db(conn).then(function (db) {
        db.query('select Count(*) as Count from Dictionary where CN=@CN  ', {CN:CN})
            .then(function (qresult) {

                if (qresult[0].Count) {
                    callback(qresult[0].Count);
                } else {
                    callback(0);
                }

            })
            .catch(function (error) {
                callback(1,error);
            })
            .finally(function () {
                db.close();
            });
    });
}

//查询这个用户代理哪些人的用户
exports.QueryUserbyId=function(req,res){
    var userid=req.session['username'];
    if(userid) {
        sworm.db(conn).then(function (db) {
            db.query('exec S_GetProxyWF @UserId', {UserId: userid})
                .then(function (result) {
                    res.send(200, result);
                })
                .catch(function (error) {
                    res.send(500, error);
                })
                .finally(function () {
                    db.close();
                });
        });
    }else {
        res.send(500, "userid is null");
    }
}


exports.getAuth=  function (request,path,userid,tcode,callback){

    var ret           = {};
    var url;
    if (userid && tcode) {
        url =  path+ 'api/HSSE/CheckTCode?username='+userid+'&tcode='+tcode;
        console.log(url);
        request(
            { method: 'GET', uri: url
            }
            , function (error, response, body) {
                if (error) {
                    console.log(error);
                    log.error(err);
                    ret.IsSuccess = null;
                    callback(ret);

                } else {
                    if (response.statusCode == 200) {

                        if (body == "true") {
                            console.log(body);
                            ret.IsSuccess = true;
                            callback(ret);
                        }else
                        {
                            ret.IsSuccess = null;
                            callback(ret);
                            return;
                            //  res.json(ret);
                        }
                    }else{

                        log.error('error getAuth!' + response.statusCode);
                        ret.IsSuccess = null;
                        callback(ret);
                        return;
                    }
                }
            });
    }else{
        ret.IsSuccess = null;
        callback(ret);
        return;

    }
}
exports.getStartForm=function(rest,para,callback){
    var url = rest+'process-definition/'+para.id +'/startForm';
    console.log(url);
    request(
        { method: 'GET'
            , uri:url
        }
        , function (error, response, body) {
            if(error){
                log.error(error);
                callback (null,error);
            }else{
                if(response.statusCode == 200){
                    var formkey=JSON.parse(body).key;
                    callback(formkey);
                } else {
                    log.error(response);
                    callback (null,"Get Start From failed"+ response.statusCode);
                }
            }
        })
}
//get bpm process key
exports.getProcessKey=function (rest,id,callback){

    var url = rest+'process-definition/'+id ;
   log.debug(url);
    request(
        { method: 'GET'
            , uri:url
        }
        , function (error, response, body) {
            if(error){
                console.log(error);
                callback (null,"连接失败"+error.code);
            }else{
                if(response.statusCode == 200){
                    var body=JSON.parse(body);//流程的key
                    callback(body);
                } else {
                    callback (null,"得到getProcessKey失败"+ response.statusCode);
                }
            }
        });
}

function GetProcess(rest,taskId,callback){
    var url = rest+'task/'+taskId ;
    log.debug(url);
    request({ method: 'GET' , uri:url
        }
        , function (error, response, body) {
            if(error){
                log.error(error);
                callback (null,error+error.code);
            }else{
                if(response.statusCode == 200){
                    var body=JSON.parse(body);
                    callback(body,"");

                } else {
                    log.trace('error: '+ response.statusCode)
                    callback (null,"don't get  processid, "+ response.statusCode);
                }
            }
        })
}
//设置变量的name 出掉
exports.setVariables=function(variables){
    var  from={};
    var formdata=variables;
    for(var key in formdata){
        //  console.log(key);
        from[key]=formdata[key].value;;
        //   console.log(formdata[key].value);
    }
    console.log(from);
    return from;
}
 exports.getTaskform =function(rest,id,callback){
    var url = rest+'task/'+id +'/form';
    request( { method: 'GET' , uri:url }  , function (error, response, body) {
            if(error){
                log.error(error);
                callback (null,error);
            }else{
                if(response.statusCode == 200){
                    var formkey=JSON.parse(body).key;
                    callback(formkey,null);
                } else {
                    log.debug('error: '+ response.statusCode)
                    callback (null,"get taskForm failed,"+response.statusCode);
                }
            }
        })
}
exports.saveForms=function(data,callback){
    var ret           = {};
//    var data      = {};
    console.log("saveForms start");
    var formsProject=new FormsProject(data);
    formsProject.save(function(err){
        if(err){
            console.log("error start");
            console.log(err);
            console.log("error end");
            ret.IsSuccess = false;
            ret.Msg       = "save form failed";

        }else{
            ret.IsSuccess = true;
            ret.Msg       = "save from suc";
            console.log("saveForms end");
        }

        callback(ret);
    });
}


exports.removeForms=function(data){
    var ret           = {};
    FormsProject.remove({ key:data.key,processInstanceId:data.processInstanceId,executionId:data.executionId  }, function(err) {
        if (err) {
            log.error(err);
            ret.IsSuccess = false;
            ret.Msg = "delete froms failed";
        }
        else {
            ret.IsSuccess = true;
            ret.Msg       = "";

        }
        return ret;
    });

}
exports.getProcessTaskKey=function(rest,id,callback){
    var url = rest+'task/'+id ;
    request( { method: 'GET' , uri:url   } , function (error, response, body) {
            if(error){
                log.error(error);
                callback (null,error);
            }else{
                if(response.statusCode == 200){
                    var body=JSON.parse(body);//流程的key
                    callback(body);
                } else {
                    callback (null,"get 得到getProcessTaskKey failed,"+response.statusCode);

                }
            }
        });
}


exports.getVariables=function (rest,taskId,callback) {
    var url = rest+'task/'+taskId ;
    GetProcess(rest,taskId, function (process, message) {
        if (message) {
            callback(null, null, message);
            return;
        }else {
            var pid = process.processInstanceId;
            if (pid) {
                var url = rest + 'process-instance/' + pid + '/variables';
                console.log(url);
                request({ method: 'GET', uri: url }, function (error, response, body) {
                    if (error) {
                        log.error(error);
                        callback(null, error);
                    } else {
                        if (response.statusCode == 200) {
                            callback(JSON.parse(body), pid, "");
                        } else {
                            callback(null, pid, "Get variables failed," + response.statusCode);
                        }
                    }
                })
            }
            else {
                callback(null, pid, "pid is null");
            }
        }

    })

}

