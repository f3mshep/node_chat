require("./config/config");

const path = require('path');
const bodyParser = require("body-parser");
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const _ = require('lodash');
const { ObjectID } = require("mongodb");

const {generateMessage} = require('./utils/message')
const {connectedUsers} = require('./utils/connected_users')
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongo');

PORT = process.env.PORT || 5000

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

io.on('connection', (socket)=>{
  console.log('New client connected')
  socket.authenticated = false
  socket.emit("newMessage", generateMessage('Admin', 'Welcome to NodeChat'));
  socket.broadcast.emit("newMessage", generateMessage("Admin","New user joined"));

  socket.on('signOn', data => {
    socket.username =  data.username
    socket.authenticated = true
    let users = connectedUsers(io.sockets.connected)
    socket.emit('userJoin', users)
  })



  socket.on('createMessage', (message, callback)=>{
    console.log('New Message: ', message)
    io.emit('newMessage', generateMessage(socket.username, message.text));
    callback('Acknowledged');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected')
  });
});

//authentication

app.post('/users', (req, res)=>{
  const body = _.pick(req.body, ['username', 'password'])
  const newUser = new User(body);
  newUser.save().then(() => {
    return newUser.generateAuthToken();
  })
    .then((token) => {
      return res.header('x-auth', token).send(newUser);
    }).catch((error) => res.status(400).send({ error }));
});

app.post('/users/login', (req, res)=>{
  const body = _.pick(req.body, ['username', 'password'])
  User.findByCredentials(body)
  .then(doc => {
    return doc.generateAuthToken()
    .then(token => {
      res.header('x-auth', token).send(doc)
    })
  })
});


server.listen(PORT, ()=>{
  console.log(`Listening on ${PORT}`)
});
