const getConnectedUsers = (sockets)=>{
  users = []
  for (const client in sockets){
    users.push(sockets[client]);
  }
  return users;
}

const getConnectedUsernames = (sockets) => {
  users = getConnectedUsers(sockets)
  console.log('got connected users')
  const userNames = users.map(user => user.username)
  return [...new Set(userNames)];
}

module.exports = {getConnectedUsernames}