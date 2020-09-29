const express = require('express');
const router = express.Router();
const mysql = require('../../db/mysql/index');
const utils = require('../../public/javascripts/utils');
const uuid = require('uuid');
// const jwt = require('jsonwebtoken');
/**
 * @description: 用户登录
 * @Date: 2020-09-17
 */
router.post("/login",async(req,res,next)=>{
    const {username, password} = req.body;
    if(username && password) {
        let upsql = `update user set token = 1 where username ='${username}' and password = '${password}' limit 1`;
        let result = await mysql.DB2(upsql);
        if(result === 1) {
            let sql = `select * from user where username ='${username}' and password = '${password}' limit 1`;
            let result2 = await  mysql.DB1(sql);
            if(result2.length === 1) {
                let data = result2[0];
                delete  data.password;
                utils.outPut(res, 200,data);
            }else {
                utils.outPut(res,553);
            }

        }else {
            utils.outPut(res,553);
        }
    }else {
        utils.outPut(res,554);
    }
});
/**
 * 用户登出
 * */
router.post("/loginout",async(req,res,next)=>{
    let data = req.body;
    if(data.id) {
        let sql = `update user set token = 0 where  id='${data.id}' and token = 1 limit 1`;
        let result = await mysql.DB2(sql);
        if(result === 1) {
             utils.outPut(res, 200)
        }else {
            utils.outPut(res,500);
        }
    }else {
        utils.outPut(res,554);
    }
});
/**
 * 用户注册
 * */
router.post("/adduser",async(req,res,next)=>{
   let {username, password} = req.body;
   if(username && password) {
       let id = uuid.v1();
       let sql = `insert into user set id = '${id}', username ='${username}', password = '${password}',age='18'`;
       let result = await mysql.DB2(sql);
       if(result === 1) {
           utils.outPut(res, 200)
       }else {
           utils.outPut(res,500);
       }
   }else {
       utils.outPut(res,554);
   }
});
module.exports = router;