
    var sworm = require('sworm');
    var config = require('./../config.json');
    var log = require('log4js').getLogger("Filter");
var conn="";
// exports.DBSQLConnection=function(config){
//     conn=  {
//         driver: 'mssql',
//         config: {
//             user: config.dbuser,
//             password: config.dbpassword,
//             server:config.datasource,
//             database: config.database
//         }
//     };
// }
console.log(conn);
// exports.AuthPower=function (RoleId,Path,callback){
//         console.log("-------AuthPower start--------")
//         sworm.db( conn).then(function (db) {
//             db.query('exec S_CheckPower @UserId,@Path,@Action', {UserId: "",Path:"",Action:""})
//                 .then(function (result) {
//                     db.close();
//                     console.log("-------AuthPower end--------")
//                     if(result.length<=0){
//                         console.log("------NO AUTH--------")
//                         callback(null,"NO AUTH");
//                     }else {
//                         callback(result);
//                     }
//                 })
//                 .catch(function (error) {
//                     log.error(error);
//                     db.close();
//                     callback(null,error)
//                 })

//         });

//     }






