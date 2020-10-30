const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const fileUploaded = new Map();
exports.up = function (dir) {
    return function (req, res, next) {
        const form = new formidable.IncomingForm();
        // console.log(req);
        form.uploadDir = dir;
        form.hash = 'md5';
        // form.encoding = 'utf-8'; //设置编辑
        // form.uploadDir = 'public/file'; //设置上传目录
        // form.keepExtensions = true; //保留后缀
        form.maxFieldsSize = 1024 * 1024 * 1024;   //内存大小 k
        form.maxFileSize = 1024*1024*1024; //文件大小
        let newName = '';
        let oldPath = '';
        form.parse(req, function (err, fields, files) {
            newName = files.file.name;
            oldPath = files.file.path;
            if(err) {
                console.log(err);
                return false;
            }
            // console.log(fields);
            // console.log(files);
            // err是错误，fields是包含的表单内的字符串信息，
            // files包含的是上传的文件信息，上传成功后，可以到设置的文件目录查看文件
            // files.file.lastModifiedDate = files.file.lastModifiedDate.toLocaleString();
            // if (fileUploaded.has(files.file.hash)) {
            //     console.log(fileUploaded);
            //     // fs.unlink(filepath, function(err){
            //     //     if(err){
            //     //         throw err;
            //     //     }
            //     //     console.log('文件:'+filepath+'删除成功！');
            //     // });
            //     return res.send({status: 556, msg: '文件已存在'});
            // }
            // let f = {
            //     // newName:  fields.name.length == 0
            //     // ? files.file.name
            //     //     : fields.name + path.extname(files.file.name),
            //     newName: 'upload_' + files.file.hash + '_' + files.file.name,
            //     file: files.file,
            // };
            // fileUploaded.set(files.file.hash, f);
            // let newName = '';
            //  !newName ? newName = 'upload_' + Date.now() + '_' + files.file.name:'';
            // fs.rename(files.file.path, path.join(form.uploadDir, newName), function (err) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log(files.file.name);
            //     res.send({status: 200, msg: '上传成功',data: 'http://localhost:3000/files/'+newName});
            //     console.log('Finished');
            // });
        });

        const io = req.app.get('socketIo');
        // console.log(io);
        form.on('progress', function (bytesReceived, bytesExpected) {
            let precent = Math.floor(bytesReceived / bytesExpected * 100);
            console.log(precent);
            let progress = {
                name: 'progress',
                precent,
            };
            io.emit('progress', progress);
        });
        form.on('end',function () {
          newName = 'upload_' + Date.now() + '_' + newName;
            fs.rename(oldPath, path.join(form.uploadDir, newName), function (err) {
                if (err) {
                    console.log(err);
                }
                res.send({status: 200, msg: '上传成功',data: 'http://localhost:3000/files/'+newName});
                console.log('Finished');
            });
        });
    };
};
exports.download = function (dir) {
    return function (req, res, next) {
        let id = req.params.id;
        let file = fileUpload.get(id);
        let targetPath = path.join(dir, file.file.name);
        res.download(targetPath, file.newName);
    };
};