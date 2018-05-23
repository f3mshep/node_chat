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
  socket.on('disconnect', () => {
    console.log('User disconnected')
  });
});


server.listen(PORT, ()=>{
  console.log(`Started on ${PORT}`)
});
