require("./config/config");

const socketioJwt = require('socketio-jwt');
const path = require('path');
const bodyParser = require("body-parser");
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const _ = require('lodash');
const { ObjectID } = require("mongodb");

const {generateMessage} = require('./utils/message')
const { getConnectedUsernames } = require('./utils/connected_users')
const { User } = require('./models/user');
const { isValidToken } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongo');

PORT = process.env.PORT || 5000
SECRET = process.env.JWT_SECRET
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

io.on('connection', (socket)=>{
  console.log('New client connected')
  let users = getConnectedUsernames(io.sockets.connected)
  socket.broadcast("updateUsers", getConnectedUsernames(io.sockets.connected));

  socket.on('authenticate', token => {
    User.findByToken(token)
    .then(
      (user) => {
        socket.emit('authenticated')
        socket.username = user.username;
        socket.emit("updateUsers", getConnectedUsernames(io.sockets.connected));
        //handle creating new messages
        socket.emit("newMessage", generateMessage('Admin', 'Welcome to NodeChat'));
        socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

        socket.on('createMessage', (message, callback) => {
          io.emit('newMessage', generateMessage(socket.username, message.text));
          callback('Acknowledged');
        });
        //handle disconnection
        socket.on('disconnect', () => {
          console.log('User disconnected')
          socket.emit("updateUsers", getConnectedUsernames(io.sockets.connected));
        });
        },
      (err)=>{
        socket.emit('rejected')

      }
    )
  })

});

//authentication

app.post('/users', (req, res)=>{
  const body = _.pick(req.body, ['username', 'password'])
  const newUser = new User(body);
  console.log(body)
  newUser.save()
  .then(() => {
    return newUser.generateAuthToken();
  })
  .then((token) => {
    return res.send({token})
  }).catch((error) => res.status(400).send({ error }));
});

app.post('/users/login', (req, res)=>{
  const body = _.pick(req.body, ['username', 'password'])
  User.findByCredentials(body.username, body.password)
  .then(doc => {
    return doc.generateAuthToken()
    .then(token => {
      res.send({token})
    })
    }).catch((error) => res.status(400).send({ error }));
});


server.listen(PORT, ()=>{
  console.log(`Listening on ${PORT}`)
});

module.exports = app;