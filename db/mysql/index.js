const mysqlConf = {
    db1: {
        connectionLimit: 100, //连接数量
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'living',
        port: 3306,
    }
};

//封装数据库sql操作
async function DB1(sql) {
    let mysql = require('mysql');
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(mysqlConf.db1);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
        connection.end();
    });
}
async function DB2(sql) {
    let mysql = require('mysql');
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(mysqlConf.db1);
        connection.connect();
        connection.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows.affectedRows);
        });
        connection.end();
    });
}
async function DB3(sql) {
    let mysql = require('mysql');
    let pool = mysql.createPool(mysqlConf.db1);
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log(err);
            } else {
                conn.query(sql, function (err, results, fields) {
                    if (err) {
                        resolve(err);
                    } else {
                        resolve(results);
                    }
                });
                //释放连接
                conn.release();
            }
        });
    });
}
module.exports = {
    DB1,
    DB2
};