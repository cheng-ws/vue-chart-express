var socketIo = {};
// var socket_io = require('socket.io');
const _ = require('underscore');
const moment = require('moment');
const userData = require('./users.json');
const USER_STATUS = ['ONLINE','OFFLINE'];
const users = {};
const chatList = {};
//获取io
socketIo.getSocketIo = function (io) {
   // let io = socket_io.listen(server);

   io.sockets.on('connection',socket=>{
       console.log('连接');
       //上线
       socket.on('online',username => {
           socket.username = username;
           users[username] = {
               socketId: socket.id,
               status: USER_STATUS[0],
           };
           socket.emit('onLineUser',users); // 发送给自己
           socket.broadcast.emit('onLineUser',users); // 发送给其他人
           console.log(users);
       });
      //离线
      //  socket.on('disconnect',reason=> {
       //       //      console.log('disconnect: ', reason);
       //       //      if(users[socket.username]) {
       //       //          users[socket.username].status = USER_STATUS[1];
       //       //      }
       //       //      socket.emit('onLineUser',users); // 发送给自己
       //       //      socket.broadcast.emit('onLineUser',users); // 发送给其他人
       //       //  });
       //私发
       socket.on('privateChat',(data)=>{
           let params = JSON.parse(data);
           console.log(params);
           const receiver = users[params.receiver];
           params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
           // const senderData = _.findWhere(userData,{username: params.sender});
           // params.senderPhoto = (senderData || {}).photo;
           // if(!params.senderPhoto) {
           //     const senderLen = params.sender.length;
           //     params.senderPhotoNickname = params.sender.substr(senderLen - 2);
           // }
           // fn(params);
           console.log(receiver);
           if(receiver && receiver.status === USER_STATUS[0]) {
               socket.to(users[params.receiver].socketId).emit('replyPrivateChat',params); //发送给对方
               // socket.to(users[params.receiver].socketId).emit('reply_private_chat',params);
           }else {
               console.log(`${params.receiver}不在线`);
           }
       });
       //用户信息
       socket.on('user',()=> {
           socket.emit('onLineUser',users); // 发送给自己
           socket.broadcast.emit('onLineUser',users); // 发送给其他人
       });
   })
};
module.exports = socketIo;