// const express = require('express');
// const app = express();
// const path = require('path');
// const server = require('http').createServer(app);
// const server = require('http').Server(app);
// const PORT = 300010;
// app.use(express.static(path.join(__dirname, '../', 'public')));
// const io = require('socket.io')(server);
// io.listen('8081');

const _ = require('underscore');
const moment = require('moment');
const userData = require('./users.json');
const USER_STATUS = ['ONLINE','OFFLINE'];
const users = {};
module.exports = () => {
    io.on('connection',socket=>{
        console.log('server');
        socket.on('online',username => {
            socket.username = username;
            users[username] = {
                socketId: socket.id,
                status: USER_STATUS[0],
            };
        });
        socket.on('private_chat',(params,fn)=>{
            const receiver = users[params.receiver];
            params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const senderData = _.findWhere(userData,{username: params.sender});
            params.senderPhoto = (senderData || {}).photo;
            if(!params.senderPhoto) {
                const senderLen = params.sender.length;
                params.senderPhotoNickname = params.sender.substr(senderLen - 2);
            }
            fn(params);
            if(receiver && receiver.status === USER_STATUS[0]) {
                socket.to(users[params.receiver].socketId).emit('reply_private_chat',params);
            }else {
                console.log(`${params.receiver}不在线`);
            }
        });
        socket.on('disconnect',reason=> {
            console.log('disconnect: ', reason);
            if(users[socket.username]) {
                users[socket.username].status = USER_STATUS[1];
            }
        });
    });
};