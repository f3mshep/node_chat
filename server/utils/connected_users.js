const connectedUsers = (sockets)=>{
  users = []
  for (const client in sockets){
    users.push(sockets[client].username);
  }
  return users;
}

module.exports = {connectedUsers}