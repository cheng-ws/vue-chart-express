const express = require('express');
const User = require('../models/user');
const router = express.Router();
const utils = require('../../../public/javascripts/utils');
const setting = require('../../../assets/token/setting');
const verify = require('../../../assets/token/verify');
const bcrypt = require("bcrypt-nodejs");
// router.use(function (req,res,next) {
//     res.locals.curentUser = req.user;
//     res.locals.errors = req.flas("error");
//     res.locals.infos = req.flash('info');
//     next();
// });
// router.get("/",function (req,res,next) {
//     User.find()
//         .sort({createdAt: "descending"})
//         .exec(function (err,users) {
//             if(err) {return next(err);}
//             res.render("index",{user:users})
//         });
// });
router.post('/register', function (req, res, next) {
    //参数解析
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return utils.outPut(res, 554);
    }
    new Promise((resolve, reject) => {
        User.findOne({username}).exec((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((result) => {
        if (result) {
            utils.outPut(res, 556);
        } else {
            //新建用户
            const newUser = new User({
                username: username,
                password: password,
            });
            //插入记录
            newUser.save().then(response => {
                let data = response;
                if (data._id) {
                    let {_id, username, createAt} = data;
                    let id = _id.toString();
                    verify.setToken(username).then(token => {
                        return res.json({
                            status: 200,
                            msg: '注册成功',
                            data: {
                                signTime: setting.token.signTime,
                                token,
                                _id,
                                username,
                                createAt,
                            }
                        });
                    });
                } else {
                    utils.outPut(res, 500, null, '注册失败');
                }
            }).catch(err => {
                utils.outPut(res, 500, null, '注册失败');
            });

        }
    }).catch((err) => {
        utils.outPut(res, 500);
    })

});
router.post('/signup', function (req, res, next) {
    //参数解析
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return utils.outPut(res, 554);
    }
    new Promise((resolve, reject) => {
        User.findOne({username}).exec((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((result) => {
        // console.log(result);
        if (result) {
            let flag = true;
            bcrypt.compare(password, result.password, function (err, flag) {
                if (flag) {
                    let {_id, username, createAt} = result;
                    verify.setToken(result.username)
                        .then(token => {
                            req.session[username]= 'online';
                            return res.json({
                                status: 200,
                                msg: '登录成功',
                                data: {
                                    signTime: setting.token.signTime,
                                    token,
                                    _id,
                                    username,
                                    createAt,
                                }
                            });
                        });
                } else {
                    utils.outPut(res, 553);
                }
            });

        } else {
            utils.outPut(res, 553);
        }
    }).catch((err) => {
        utils.outPut(res, 500, null, '登录失败');
    })
});
router.post('/signdown',function (req,res,next) {
    let id = req.body.id;
    if (!id) {
        return utils.outPut(res, 554);
    }
    new Promise((resolve, reject) => {
        // 0,不显示，1，显示
        User.findOne({_id:id}).exec((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((result) => {
        if (result) {
            req.session[result.username] = 'outline';
            utils.outPut(res, 200, null, '退出成功');
        } else {
            utils.outPut(res, 500, null, '退出失败，请重试');
        }
    }).catch((err) => {
        utils.outPut(res, 500, null, '退出失败，请重试');
    })
});
router.post('/userlist', function (req, res, next) {
    new Promise((resolve, reject) => {
        // 0,不显示，1，显示
        User.find({}, {password: 0}).exec((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }).then((result) => {
        if (result) {
            utils.outPut(res, 200, {list:result,page:{}}, '用户列表查询成功');
        } else {
            utils.outPut(res, 500, null, '用户列表查询失败');
        }
    }).catch((err) => {
        utils.outPut(res, 500, null, '用户列表查询失败');
    })
});
module.exports = router;
