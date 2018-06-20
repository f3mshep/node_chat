require("./config/config");

const socketioJwt = require('socketio-jwt');
const path = require('path');
const bodyParser = require("body-parser");
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const _ = require('lodash');
const { ObjectID } = require("mongodb");

const middleware = require('./utils/middleware')
const { User } = require('./models/user');
const { Room } = require('./models/room');
const { isValidToken } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongo');

PORT = process.env.PORT || 5000
SECRET = process.env.JWT_SECRET
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.json());

//sockets

// TODO: Assign socket to username. Have user class manage its sockets
// Can have static methods like #getAllUsersConnected
// On sign on, can assign socket to user, when user signs off unassign socket
// downsides: another point of failure

io.on('connection', (socket)=>{
  console.log('New client connected')

  socket.on('authenticate', token => {
    User.findByToken(token)
    .then(
      (user) => {
        //add user to socket
        middleware.authenticateUser(user,socket);
        middleware.joinRoom(user, user._currentRoom)

        //notify clients that a new user joined
        io.emit("updateUsers", middleware.getConnectedUsernames(io.sockets.connected));

        //server notifications
        socket.emit("newMessage", middleware.generateMessage('Admin', 'Welcome to NodeChat'));
        socket.broadcast.emit("newMessage", middleware.generateMessage("Admin", "New user joined"));

        // new messages
        socket.on('createMessage', (message, callback) => {
          io.emit('newMessage', middleware.generateMessage(socket.username, message.text));
          callback('Acknowledged');
        });

        // handle room join
        socket.on('joinRoom', (roomObj)=>{
          Room.findByName(roomObj.name).then(room => {
            middleware.joinRoom(user, room)
          }).catch(err => socket.emit('rejected', err))
        })

        //handle disconnection
        socket.on('disconnect', () => {
          console.log('User disconnected')
          user.handleDisconnect()
          io.emit("updateUsers", middleware.getConnectedUsernames(io.sockets.connected));
        });
        },
      (err)=>{
        socket.emit('rejected')
      }
    )
  })
});

//authentication API endpoints

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