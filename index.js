const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
//token 验证
const expressJwt = require('express-jwt');
const setting = require('./assets/token/setting');
const verify = require('./assets/token/verify');
//session
const session = require("express-session");
const app = express();
const loginRoutes = require("./routes/mongoR/routes/login");
// 连接到你MongoDB服务器的test数据库
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 100, //设置session的有效时间
    }
}));
//解析token获取用户信息
app.use((req, res, next) => {
    //获取请求头中的参数
    let token = req.headers[setting.token.header];
    if (token === undefined) {
        let url = req.url;
        let unRoute = setting.token.unRoute;
        if(unRoute.indexOf(url) > -1) {
            return next();
        }else{
            return res.status(403).send({status:403,msg:'没有携带token'});
        }
    } else {
        //token校验并将校验结果保存至请求头中
        verify.getToken(token)
            .then((data) => {
                if(data.code < 0) {
                    return res.status(403).send({status:403,msg:data.msg});
                }else{
                    console.log(data.userInfo);
                    let session = req.session;
                    console.log(session);
                    let username = data.userInfo.username;
                    if(session[username] && session[username] === 'online') {
                        return next();
                    }else{
                        return res.status(403).send({status: 403,msg: '用户已退出，请重新登录！'});
                    }
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(403).send({status: 403,msg: '无效token'});
            });
    }
});
// //验证token是否过期并规定哪些路由不用验证
// app.use(expressJwt({
//     secret: setting.token.signKey,
//     algorithms: ['HS256'],
//     credentialsRequired: true,//设置false就不验证了，游客也可以访问
// }).unless({
//     //除了这个地址，其他的URL都需要验证
//     path: setting.token.unRoute
// }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/login',loginRoutes);
// //当token失效返回提示信息
app.use((err,req,res,next)=>{
    // console.log(err);
    if(err.status === 403) {
        return res.status(err.status).json({
            status: err.status,
            msg: err.msg,
            // error: err.name + ':' + err.message,
        });
    }
});


app.listen(app.get("port"), function () {
    console.log("Server started on port " + app.get("port"));
});
