const getConnectedUsers = (sockets)=>{
  users = []
  for (const client in sockets){
    users.push(sockets[client]);
  }
  return users;
}

const getConnectedUsernames = (sockets) => {
  users = getConnectedUsers(sockets)
  return users.map(user => user.username)
}

module.exports = {getConnectedUsernames}