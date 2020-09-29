const express = require('express');
const router = express.Router();
const mysql = require('../../db/mysql/index');
const utils = require('../../public/javascripts/utils');
const uuid = require('uuid');
// const jwt = require('jsonwebtoken');
/**
 * @description: 用户查询
 * @Date: 2020-09-21
 */
router.post("/search", async (req, res, next) => {
    let {currentPage,currentSize,searchKey} = req.body;

    if(currentSize > 0 && currentPage > 0) {
        let total = 0;
        let key = searchKey === '' ? '%' : '%'+searchKey+'%';
        let numSql = `SELECT COUNT(*) num  FROM user where username like '${key}'`;
        let count = await mysql.DB1(numSql);
        console.log(count);
        if(count.length > 0 ) {
            total = count[0].num;
            total === 0 ? utils.outPut(res, 555) : '';
        }else {
            utils.outPut(res, 500);
        }
        let sql = `select * from user where username like '${key}' limit ${currentSize} offset ${currentSize * (currentPage - 1)}`;
        let result = await mysql.DB1(sql);
        // console.log(result);
        if (result.length > 1) {
            result.map(item=>{
                delete item.password;
            });
            let obj = {
                list: result,
                page: {
                    currentPage,
                    currentSize,
                    total,
                }
            };
            utils.outPut(res, 200,obj);
        } else {
            utils.outPut(res, 500);
        }
    }else {
        utils.outPut(res, 554);
    }

});
/**
 * 用户删除
 * */
router.post("/del", async (req, res, next) => {
    let data = req.body;
    if (data.id) {
        // let sql = `delete from user where  id='${data.id}' limit 1`;
        let ids = data.id;
        let sql = `delete from user where id in (${ids}) `;
        let result = await mysql.DB2(sql);
        console.log(result);
        if (result > 0) {
            utils.outPut(res, 200)
        } else {
            utils.outPut(res, 500);
        }
    } else {
        utils.outPut(res, 554);
    }
});
/**
 * 用户添加
 * */
router.post("/add", async (req, res, next) => {
    let {username, password,age,email} = req.body;
    if (username && password) {
        let id = uuid.v1();
        let sql = `insert into user set id = '${id}', username ='${username}', password = '${password}',age ='${age}',email='${email}'`;
        let result = await mysql.DB2(sql);
        if (result === 1) {
            utils.outPut(res, 200)
        } else {
            utils.outPut(res, 500);
        }
    } else {
        utils.outPut(res, 554);
    }
});
module.exports = router;