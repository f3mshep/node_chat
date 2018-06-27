const { Room } = require("../models/room");

const getConnectedUsers = (sockets)=>{
  users = []
  for (const client in sockets){
    users.push(sockets[client]);
  }
  return users;
}

const getConnectedUsernames = (sockets) => {
  users = getConnectedUsers(sockets)
  const userNames = users.map(user => user.username)
  return [...new Set(userNames)];
}

const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

const authenticateUser = (user, socket) => {
  socket.emit('authenticated', { username: user.username });
  socket.username = user.username;
  user.socketId = socket.id;
  user.socket = socket
  user.save()
}

const findDefaultRoom = () => {
  return Room.find({}).then(rooms => {
    if (!rooms.length){
      const newRoom = new Room({name: "General"});
      newRoom.save().then(()=> newRoom)
    } else {
      return rooms[0];
    }
  });
}

const assignRoom = (user, room) => {
  user.socket.join(room.name)
  user.socket.room = room.name
  console.log(`${user.username} joined ${room.name}`)
  user.socket.emit('roomJoined', room)
}

const joinRoom = (user, room) => {
  if(!room){
    findDefaultRoom().then(room => {
      assignRoom(user, room)
    }).catch(err => console.log(err))
  } else {
    assignRoom(user, room)
  }
}

module.exports = { getConnectedUsernames, generateMessage, authenticateUser, joinRoom };