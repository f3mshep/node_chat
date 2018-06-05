const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message')

PORT = process.env.PORT || 5000

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

io.on('connection', (socket)=>{
  console.log('New user connected')

  socket.emit("newMessage", generateMessage('Admin', 'Welcome to NodeChat'));

  socket.broadcast.emit("newMessage", generateMessage("Admin","New user joined"));

  socket.on('createMessage', (message, callback)=>{
    console.log('New Message: ', message)
    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('Acknowledged');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected')
  });
});


server.listen(PORT, ()=>{
  console.log(`Listening on ${PORT}`)
});
