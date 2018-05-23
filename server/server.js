const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');


PORT = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('New user connected')

  socket.emit("userJoin", {
    from: "admin",
    text: "welcome to NodeChat",
    createdAt: new Date().getTime()
  });
  socket.broadcast.emit("userJoin", {
    from: "admin",
    text: "New user joined",
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message)=>{
    console.log('New Message: ', message)
    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected')
  });
});


server.listen(PORT, ()=>{
  console.log(`Started on ${PORT}`)
});
