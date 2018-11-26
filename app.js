var express = require('express');
var http = require('http');
var https = require('https');
var socketio = require('socket.io');
//Test thử commit
/* log4js start  */
var log4js = require('log4js');
log4js.configure('log4js.json');
var logger = log4js.getLogger("app");
logger.setLevel('TRACE');
logger.info('-nodejs opening---');
/*log4js end*/



var querystring = require('querystring');
var app = express();
var URL = require('url');
console.log([app.get('env')]);
var config = require('./config.json')[app.get('env')];
var request = require('request');
var domain = require('domain');
var s = require('string');
// var SysReqLog = require('./models/replog.js');
//创建文件夹
var fs = require('fs');
var basicService = require('./routes/basicRoute');

//加载静态页面
app.use(express.static('./web'));
app.use(express.static('./test'));

//超时时间
app.use(express.responseTime());
//错误
app.use(express.errorHandler());
//session & cookie
app.use(express.cookieParser());
app.use(express.session({ secret: 'SEKR37'}));
//

app.use(function (req, res, next) {
    var url = req.originalUrl;
    console.log(url);
    console.log("req url:" + url + " method:" + req.method + " IP:" + req.connection.remoteAddress);
    //  console.log(code);

    // //Xác thực bằng IP
    // if (!req.session['username']) {
    //     console.log("start querystring");
    //     var query = querystring.parse(URL.parse(req.url).query);
    //     //  console.log(query);
    //     var autosession = query.Token;
    //     var code = query.code;
    //     if (code) {
    //         console.log("ateam cas log" + code);
    //         var autourl = 'http://ateamma01.feg.com.tw/oauth2/getUserInfo?code=' + code;
    //         request(
    //             {
    //                 method: 'GET', uri: autourl
    //             }
    //             , function (error, response, body) {
    //                 if (error) {
    //                     console.log(error);
    //                     res.send(response.statusCode, error);
    //                 } else {
    //                     if (response.statusCode == 200) {
    //                         var userinfo = JSON.parse(body);
    //                         req.session['username'] = userinfo.UserId;
    //                         if (userinfo.UserId) {
    //                             if (userinfo.UserId.indexOf("fepv") >= 0) {
    //                                 req.session['username'] = userinfo.UserId.toLocaleUpperCase();
    //                             }
    //                         }
    //                         if (!req.session['username']) {
    //                             return res.send(response.statusCode, "no seesion Wrong userName and password");
    //                         }
    //                         req.session['email'] = userinfo.Email || "";
    //                         req.session['nickname'] = userinfo.UserName;
    //                         req.session['isAuthorize'] = true;
    //                         next();
    //                     } else {
    //                         return res.send(response.statusCode, "200 Wrong userName and password");

    //                     }
    //                 }
    //             });
    //     } else {
    //         console.log("no code");
    //     }
    // }
    //Xác thực bằng đăng nhập
    if (url != "/authorize/login?" && url != "/authorize/loginCode") {
        console.log("no log loginCode");
        if (!req.session['username']) {
            if (req.headers['authorization']) {
                req.session['username'] = req.headers['authorization'];
            } else {
                console.log("no login 4011");
                return res.send(401, 'Wrong userName and password login');
            }
        }
    }
    next();
});


var Filter = require('./appservice/Filter');
var filterAuth = function (req, res, next) {
    console.log("Filter");

    next();
}

/*app.use(filterAuth);*/
app.post('/authorize/logout', function (req, res) {
    console.log("logout");
    res.clearCookie('username');
    req.session.destroy(function (e) { res.status(200).send('ok'); });
})
app.get('/authorize/isLogin', function (req, res) {
    var username, nickname, email, bm;
    if (req.session != null && req.session['isAuthorize'] != null && req.session['isAuthorize'] != false) {
        username = req.session['username'];
        nickname = req.session['nickname'];
        email = req.session['email'];
        bm = req.session['bm'];
        if (!username) {
            res.send(401, 'Wrong user or password');
            return;
        } else {
            res.send({ username: req.session['username'], nickname: req.session['nickname'], email: req.session['email'], bm: req.session['bm'] });
            return;
        }
    }
    else {
        res.send(401, 'Wrong user or password');
        return;
    }
})

// authorize  test used
app.post('/authorize/login', express.bodyParser(), function (req, res) {
    var username = req.body.username,
        password = req.body.password;
    //var   url = config.bpmrest+'Auth/login' ;
    // var url = config.hrrest + 'api/HSSE/ValidateUser?username=' + username + '&password=' + password;
    var url = config.hrrest + 'api/ths/THSAuthLogin/AuthorLogin?username=' + username + '&password=' + password;
    //
    console.log('URL' + url);
    request(url, function (e, r, b) {
        console.log('ERRRR: ' + b);
        if (!e && r.statusCode == 200) {
            req.session['username'] = username;
            req.session['password'] = password;
            var userinfo = JSON.parse(b);
            req.session['email'] = userinfo.email;
            req.session['username'] = userinfo.username;
            req.session['nickname'] = userinfo.nickname;
            req.session['bm'] = userinfo.bm;
            console.log(req.session['nickname']);
            req.session['isAuthorize'] = true;
            res.send(b);
            return;
        }
        else {
            res.send(401, 'Wrong user or password');
            return;
        }
    });
});
app.get("/bpm/CheckTCode/:userid/:tcode", function(req, res) {
    var tcode = req.params.tcode;
    console.log("appjs tcode "+ tcode);
    console.log("appjs userid "+ req.session['username']);
    if ( req.session['username'] && tcode) {
        var url = config.hrrest + 'api/ths/THSAuthLogin/CheckTCode?username=' + req.session['username'] + '&tcode=' + tcode;
      console.log("appjs url " + url);
      request({ method: "GET", uri: url }, function(error, response, body) {
        if (error) {
          console.log(error);
          log.error(err);
          res.send(500, err);
        } else {
          if (response.statusCode == 200) {
            if (body == "true") {
              console.log(body);
              res.json({ IsSuccess: true });
            } else {
              res.json({ IsSuccess: null });
            }
          } else {
            log.error("error getAuth!" + response.statusCode);
            res.json({ IsSuccess: null });
          }
        }
      });
    } else {
      res.send(500, "userid is error");
    }
  });

// app.post('/authorize/loginToken',express.bodyParser(),function(req,res){
//     console.log("loginToken");
//     var token = req.body.token;
//     var url = config.hrrest + 'api/HSSE/ValidateUser?token=' + token ;
//     console.log(url);
//     request(url,function(e,r,b) {
//         console.log(e);
//         if (!e && r.statusCode == 200) {
//             var userinfo = JSON.parse(b);
//             req.session['username'] = userinfo.userId;
//             req.session['email'] = userinfo.email;
//             req.session['nickname'] = userinfo.nickname;
//             console.log(req.session['nickname']);
//             req.session['isAuthorize'] = true;
//             res.send(b);
//             return;
//         } else {
//             res.send(401, 'CAS TOKEN Wrong TOKEN:' + token);
//             return;
//         }
//     });
// });

// app.post('/authorize/loginCode',express.bodyParser(),function(req,res){
//     console.log("loginCode");
//     var code = req.body.code;
//     console.log(code);
//     var url = 'http://ateamma01.feg.com.tw/oauth2/getUserInfo?code=' + code;
//     console.log(url);
//     if(!req.session['username']){
//         request(url,function(e,r,b) {
//             console.log(b);
//             console.log(r.statusCode);
//             console.log(JSON.parse(b).UserId);
//             if ( r.statusCode == 200) {
//                 var userinfo = JSON.parse(b);
//                 if(userinfo.UserId){
//                     console.log(userinfo.UserId)
//                     req.session['username'] = userinfo.UserId;
//                     if(userinfo.UserId) 
//                     {
//                         if (userinfo.UserId.indexOf("fepv") >= 0) {
//                             req.session['username'] = userinfo.UserId.toLocaleUpperCase();
//                         }
//                     }
//                     req.session['email'] = userinfo.Email||"";
//                     req.session['nickname'] = userinfo.UserName||"";
//                     console.log(req.session['nickname']);
//                     req.session['isAuthorize'] = true;
//                     res.send({username:userinfo.UserId,nickname:userinfo.UserName,email:req.session['email']});
//                     return;
//                 }else{
//                     res.send(401, 'CAS  Wrong code:' + code);
//                     return;
//                 }

//             } else {
//                 res.send(401, 'CAS  Wrong code info:' + code);
//                 return;
//             }
//         });
//     }else{
//         res.send({username:req.session['username'] ,nickname:req.session['username'] ,email:req.session['email']||''});
//     }
// });
app.use(express.bodyParser());
//路由
app.use(app.router);
var GateService = require('./appservice/GateGuestService')(app, request, config, express);//
// var BPMService = require('./appservice/bpm')(app, request, config, express);//
var UploadService = require('./appservice/uploadservice')(app, request, config, express);//
var memberSignService = require('./appservice/memberSign')(app, request, basicService, config);
// app.all('/bpm/api/*', function (req, res) {
//     var x = request(config.bpmurl + req.url.replace('/bpm/api/', ''));
//     x.pipe(res).on('error', function (e) {
//         logger.error({ title: 'bpm pipe res' + config.bpmurl + req.url.replace('/bpm/api/', ''), message: e });
//         throw e;
//     });
//     req.pipe(x).on('error', function (err) {
//         logger.error({ title: 'bpm pipe' + config.bpmurl + req.url.replace('/bpm/api/', ''), message: err });
//         throw err;
//     });
// });
app.all('/ehs/gate/*', function (req, res) {
    var x = request(config.hrrest + req.url.replace('/ehs/gate/', 'api/Gate/'));
    console.log(config.hrrest + req.url.replace('/ehs/gate/', 'api/Gate/'));
    x.pipe(res);
    req.pipe(x);
});

app.all('/LIMS/*', function (req, res) {
    var x = request(config.hrrest + req.url.replace('/LIMS/', 'api/LIMS/'));
    console.log(config.hrrest + req.url.replace('/LIMS/', 'api/LIMS/'));
    x.pipe(res);
    req.pipe(x);
});
// Create by Isaac 08/11/2018
app.all('/ehs/waste/*', function (req, res) {
    var x = request(config.myrest + req.url.replace('/ehs/waste/', 'api/EHS/'));
    console.log(config.myrest + req.url.replace('/ehs/waste/', 'api/EHS/'));
    x.pipe(res);
    req.pipe(x);
});
app.all('/ths/*', function (req, res) {
    var x = request(config.myrest + req.url.replace('/ths/', 'api/ths/'));
    console.log(config.myrest + req.url.replace('/ths/', 'api/ths/'));
    x.pipe(res);
    req.pipe(x);
});

var server = http.createServer(app).listen(config.port, function () {
    console.log('server start');
});

