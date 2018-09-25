/**
 * Created by wangyanyan on 14-5-21.  bpm 的设置
 */

var request = require('request');
var config = require('./../config.json')["development"];

//对流程增加变量
exports.setVar= function setVar(pid,aVarName,value,type,callback){
    var ret    = {};
   // var aVarName="HighLeaderConfirm_IsMeeting";
  //  var value="YES";
  //  var type="String";
    var url = config.bpmrest+"process-instance/"+pid+"/variables/"+aVarName;
    var varVaule={"value" : value, "type": type};
    console.log(varVaule);
    request({ method: 'PUT' , uri:url,json:{"value" : value, "type": type} }
        , function (error, response, body) {
            if(error){
                console.log(error);
                ret.Msg = error.trace;
                ret.IsSuccess = false;

            }else{
                if(response.statusCode == 204){
                    ret.IsSuccess = true;
                    ret.Msg = "";


                } else {
                    ret.Msg = response.statusCode;
                    ret.IsSuccess = false;

                }
            }
            callback(ret);

        })
}

