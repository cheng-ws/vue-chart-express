module.exports = {
    token: {
        //token 密钥
        signKey: 'person_token_key_$$$',
        //过期时间
        signTime: 1000 * 60 * 10,
        //请求头参数
        header: 'authorization',
        //不用校验的路由
        unRoute: ['/login/signup','/login/register'],
        // unRoute: [
        //     {url: '/signup',methods: ['POST']}
        // ]
    }
};