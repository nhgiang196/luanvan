/**
 * Created by wangyanyan on 2016-08-24.
 */

module.exports =  function(app,request,config,express) {
 var log = require('log4js').getLogger("uploadservice");
 var multer = require('multer')
 var sworm = require('sworm');
 var crypto = require('crypto');
 var path = require('path');
 var fs = require('fs');

    // Storage option can be changed - check Multer docs
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var path = './uploads' // Make sure this path exists
        cb(null, path)
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            console.log(err);
            if (err) return cb(err)
            cb(null, raw.toString('hex'))
        })
    }
})

var upload = multer({
    storage: storage
})

 var    conn = {
        driver: 'mssql',
        config: {
            user: config.dbuser,
            password: config.dbpassword,
            server: config.datasource,
            database: config.database
        }
    };

app.post('/api/cmis/upload', upload.single('file'), function (req, res, next) {
    console.log("----upload------");
    log.debug(req);
    log.debug(res);
    var file=req.file;
    if( req.session['username'] ) {
        var project = {DocId: file.filename,VoucherId:req.query.VoucherId, Name: file.filename + path.extname(file.originalname), OldName: file.originalname, FolderName: file.destination, FileType: file.mimetype, Stamp: new Date(), UserId: req.session['username']};
        SaveFileDB(project, function (dbres) {
            if (dbres.IsSuccess == true) {
                res.status(200).json({ file: project});
            } else {
                res.send(500, dbres.Msg);
            }

        })
    }else{
        res.send(500, "it's not log in");
    }

})
app.delete('/api/cmis/deletefile',express.bodyParser(),function(req,res){
    console.log(req.query.DocId);
    var docid=req.query.DocId;
    var VoucherId=req.query.VoucherId;
    if(docid && req.session['username'] ){
        fs.exists('./uploads/'+docid, function(exists) {
            if(exists) {
                DeleteFileDB(docid,function(deleteres){
                    if (deleteres.IsSuccess == true) {
                        fs.unlink('./uploads/'+docid,function(err){
                            if(err) {
                                log.error(err);
                                res.send(400,error);
                            }else{
                                log.info("delete file:"+docid);
                                res.send(204);
                            }
                        });
                    } else {
                        res.send(500, deleteres.Msg);
                    }
                })

            } else {
                //Show in red
                log.info("it is not file exists:"+req.query.DocId);

                DeleteFileDB(docid,function(deleteres){
                    if (deleteres.IsSuccess == true) {
                        res.send(204);
                    } else {
                        res.send(500, deleteres.Msg);
                    }
                })
             /*   console.log(gutil.colors.red('File not found, so not deleting.'));*/
            }
        });
    }else{
        res.send(500, "file code can not null");
    }

})
 app.get('/api/cmis/testfiledb',function(req,res){
     sworm.db(conn).then(function (db) {
         db.query('select top 10 * from FileStore order by Stamp desc', {})
             .then(function (result) {
               res.send(200,result);
         })
          .catch(function (error) {
               log.error(error);
               res.send(500,error);
           })
           .finally(function () {
                    db.close();
            });
     })
 })
  app.get('/api/cmis/downfile', function (req, res) {
      console.log(req.query.filename)
      console.log(req.query.Name)
        if( req.query.filename &&  req.query.Name){
          var filepath = path.join('./uploads/', req.query.filename)
            res.download(filepath, req.query.Name);

        }
  })
 app.get('/api/cmis/showfile', function (req, res) {
     if(req.query.mimetype &&  req.query.filename) {

             res.setHeader('Content-Type', req.query.mimetype)
             console.log(req.query.filename);

             fs.exists('./uploads/'+ req.query.filename, function(exists) {
                 if (exists) {

                     fs.createReadStream(path.join('./uploads/', req.query.filename)).pipe(res).on('error', function (e) {

                         res.send(500, e);
                     });
                 } else {
                     res.send(500, "file is not exist");
                 }
             })

     }else{
         res.send(500,"3232");
     }
 })
function  SaveFileDB(projects,callback){
        var ret = {};
        sworm.db(conn).then(function (db) {
            var  FileStore=   db.model({table: 'FileStore', id:['DocId']});
            console.log(projects);
            var p = FileStore(projects);
            p.save().then(function () {
                ret.IsSuccess = true;
                ret.Msg       = "";
            })
            .catch(function (error) {
                    log.error(error);
                    ret.IsSuccess = false;
                    ret.Msg       = error;
            })
            .finally(function () {
                    db.close();
                    callback(ret);
            });
        });
    }

function DeleteFileDB(docid,callback){
    var ret = {};
    sworm.db(conn).then(function (db) {
        db.query("DELETE FROM FileStore WHERE DocId=@DocId",
            {DocId: docid})
            .then(function (result) {
                ret.IsSuccess = true;
                ret.Msg       = "";
            })
            .catch(function (error) {
                log.error(error);
                ret.IsSuccess = false;
                ret.Msg       = error;
            })
            .finally(function () {
                db.close();
                callback(ret);
            });
    })
}
}

