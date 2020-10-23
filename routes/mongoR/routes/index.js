const express = require('express');
const User = require('../models/user');
const router = express.Router();
const utils = require('../../../public/javascripts/utils');
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
router.post('/signup',function (req,res,next) {
  //参数解析
    let username = req.body.username;
    let password = req.body.password;
    // console.log(username,password);
    //调用findOne只返回一个用户，
    User.findOne({username: username},function (err,user) {
        if(err) {
            // return next(err);
            return next();
        }
        if(!username||!password) {
            return utils.outPut(res,554);
        }
        //判断用户是否存在
        if(user) {
            // res.send({code:'-1',msg: '已存在'})
            return utils.outPut(res,556)
        }
        //新建用户
        const newUser = new User({
            username: username,
            password: password,
        });
        //插入记录
        newUser.save(next);
        utils.outPut(res,200);
    });
});
module.exports = router;
