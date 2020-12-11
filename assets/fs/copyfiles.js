var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
// const crypto = require('crypto');
let files = 'C:/Users/chengws/AppData/Roaming/Microsoft/Windows/Themes/CachedFiles';
let newPath = 'C:/Users/chengws/Desktop/photo';
var filePath = path.resolve(files);
let newFilePath = path.resolve(newPath);
// console.log(path.join(__dirname,'public'));
let timer = "";
//比较文件，并删除
function compareImage (params) {
    // console.log(params);
    fs.readdir(params, function (err, files) {
        if (err) {
            console.log(err);
        } else {
            console.log(files);
            let arr = [];
            for (let i = 0; i < files.length;) {
                let firstPath = path.join(newFilePath, files[i]);
                var crypto = require('crypto');
                var fs = require('fs');

                //读取一个Buffer
                var buffer = fs.readFileSync(firstPath);
                var fsHash = crypto.createHash('md5');

                fsHash.update(buffer);
                var md5 = fsHash.digest('hex');
                // console.log("文件的MD5是：%s", md5);
                let obj = {
                    name: files[i],
                    md5,
                    count: '',
                };
                arr.push(obj);
                i++;
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length;) {
                    if (arr[i].md5 === arr[j].md5) {
                        arr[i].count = arr[i].count + arr[j].name;
                    }
                    j++;
                }
            }
            console.log(arr);
            arr.map(item => {
                if (item.count.length > 0) {
                    let secondPath = path.join(newFilePath, item.name);
                    delFile(secondPath).then(res => {
                        console.log(res);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            })
            // let count = 0;
            // for(let i=0;i<files.length;i++) {
            //     let firstPath = path.join(newFilePath,files[i]);
            //     for(let j=i+1;j<files.length;) {
            //         let secondPath = path.join(newFilePath,files[j]);
            //         let result = comparePic(firstPath,secondPath);
            //
            //         if(result) {
            //             j++;
            //         }else{
            //             count++;
            //             console.log(count);
            //             // delFile(secondPath).then(res=>{
            //             //     delRes ? files.splice(j,1):j++;
            //             // }).catch(_=>{
            //             //     j++;
            //             // });
            //         }
            //     }
            //
            // }

        }
    });

}

//删除重复文件
function delFile (path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                console.log('删除成功' + path);
                resolve(true);
            }
        });
    });
}

//文件遍历，以及复制
function fileDisplay (filePath) {
    let count = Date.now();
    // fs.readdir(newFilePath, function (err, files) {
    //     if (err) {
    //         count = Math.ceil(Math.random() * 1000000);
    //     } else {
    //         count = files.length + 1;
    //     }
    // });
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                let filedir = path.join(filePath, filename);
                let newdir = path.join(newFilePath, count + '.jpg');
                fs.copyFile(filedir, newdir, function (err) {
                    if (err) console.log('something wrong was happened');
                    else console.log('copy file succeed');
                });

                // //获取当前文件的绝对路径
                // var filedir = path.join(filePath, filename);
                // //根据文件路径获取文件信息，返回一个fs.Stats对象
                // fs.stat(filedir,function(eror, stats){
                //     if(eror){
                //         console.warn('获取文件stats失败');
                //     }else{
                //         var isFile = stats.isFile();//是文件
                //         var isDir = stats.isDirectory();//是文件夹
                //         if(isFile){
                //             console.log(filedir);　　　　　　　　　　　　　　　　　// 读取文件内容
                //             // var content = fs.readFileSync(filedir, 'utf-8');
                //             // console.log(content);
                //         }
                //         if(isDir){
                //             fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                //         }
                //     }
                // })
            });
        }
    });
}

// 调用文件遍历方法
function copyfile () {
    let time = new Date();
    let hour = time.getHours();
    if(hour > 18) {
        console.log('时间已过期');
        compareImage(newFilePath);
        let timeout = setTimeout(()=>{
            clearInterval(timer);
            clearTimeout(timeout);
        },100);

    }else {
        console.log('时间未过期');
        fileDisplay(filePath);
    }
    let timer = setInterval(() => {
        //调用比较文件
        let time = new Date();
        let hour = time.getHours();
        console.log(hour);
        if(hour > 18) {
            console.log('时间已过期');
            compareImage(newFilePath);
            let timeout = setTimeout(()=>{
                clearInterval(timer);
                clearTimeout(timeout);
            },100);

        }else {
            console.log('时间未过期');
            fileDisplay(filePath);
        }
    }, 1000*60);
}
// 复制文件
copyfile();
// pkg -t win
