const jwt = require('jsonwebtoken');
const setting = require('./setting');
const verify = {
    //设置token
    setToken (username) {
        return new Promise(resolve => {
            let token = jwt.sign(
                //存储数据，自定义
                {username},
                //密钥
                setting.token.signKey,
                //过期时间
                {expiresIn: setting.token.signTime}
            );
            resolve(token);
        })
    },
    getToken (token) {
        return new Promise((resolve) => {
            //判断token是否存在，这里是根据空格分隔
            if (!token.split(' ').length) {
                resolve({code: -1, msg: 'token格式错误'});
            } else {
                //解密token并返回数据
                jwt.verify(token.split(' ')[1], setting.token.signKey, function (err, decode) {
                    if (err) {
                        // console.log(err);
                        switch (err.name) {
                            case 'JsonWebTokenError':
                                resolve({code: -2, msg: '无效的token'});
                                break;
                            case 'TokenExpiredError':
                               resolve({code: -3, msg: 'token过期'});
                                break;
                        }
                    }else {
                        resolve({code: 0,msg: 'token有效',userInfo:decode});
                    }
                });

            }
        });
    }
};
module.exports = verify;