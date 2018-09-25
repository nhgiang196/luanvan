/**
 * Created by wangyanyan on 14-3-13.
 */
// var FormsHistroy = require('./../models/forms.js');


//表单的历史记录
exports.query= function(req,res) {
    var ret        = {} ;
    var query={};
    query.key=req.params.key;
    if(req.body.appliyUser){
        query.appliyUser=req.body.appliyUser;
        console.log(req.body.appliyUser);
    }
  query.sync={$gte:req.body.start,$lte:req.body.end}
    query.taskDefinitionKey="start"
    console.log(query);
    FormsHistroy.find(query,function (err, dbdata) {
        if(err){
            console.log("error");
            ret.error = {"ErrorCode":"DBError","ErrorMsg":"dberror query location"};
            res.json(ret);
        }else
        {
            console.log("----------");
            console.log(dbdata);
            return  res.json(dbdata);
        }

    });


}
//表单的数据的保存
exports.add = function(req,res){
    var id    = req.body.Id,
         time  = null,
         username=req.body.Username,
         fieldname  = req.body.FieldName,
         isallday = req.body.dataType ,
         text  = req.body.Text ;


}