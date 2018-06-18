const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    required: true,
    trim: true,
    unique: true
  },
  currentUsers: [{
    type: Number,
    ref: 'User'
  }]
})

RoomSchema.methods.addUser = function(socket, user){
  const Room = this;
  socket.join(Room.name);
  Room.currentUsers.push(user);
}

RoomSchema.methods.removeUser = function(removedUser){
  Room.currentUsers = Room.currentUsers.filter(user => user !== removedUser );
}


const Room = mongoose.model('Room', RoomSchema)

module.exports = { Room };