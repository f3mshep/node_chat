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

const joinRoom = (user, room) => {
  user.joinRoom(room)
  user.socket.join(room.name)
  user.socket.emit('roomJoined', room)
}

module.exports = { getConnectedUsernames, generateMessage, authenticateUser, joinRoom };