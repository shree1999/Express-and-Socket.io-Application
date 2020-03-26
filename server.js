const http           = require('http');
const express        = require('express');
const socketio       = require('socket.io');
const path           = require('path');
const formatString   = require('./utils/formatting');
const { joinUsers,  getCurrentUser, userLeave, getRoomUsers } = require('./utils/users'); 


const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const botName = 'ChatBoard Bot'; 

const io = socketio(server);


io.on('connection', socket => {


  socket.on('joinRoom', ({username, room}) => {
    const user = joinUsers(socket.id, username, room);

    socket.join(user.room);
    socket.emit('message', formatString(botName, 'Welcome to ChatBoard'));

    socket.broadcast
      .to(user.room)
      .emit('message', formatString(user.username , ` has joined the chat-room`));

    socket.on('chatMessages', msg => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatString(user.username, msg));
    });

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

    
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io
      .to(user.room)
      .emit('message', formatString(botName, ` ${user.username} has left the Chat-Room`));
    }
    
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server up and running");
});