const socket = io();

var date = new Date()

socket.on('connect', function () {
  console.log('Connected to server')
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('newMessage', function (message) {
  console.log('New Message:', message)
  console.log('is this thing on')
  const li = $('<li></li>')
  li.text(`${message.from}: ${message.text}`)
  $('#messages').append(li)
})

if(date.getUTCDay() === 3){
  socket.emit('createMessage', {
    from: 'Admin',
    text: 'It is Wednesday my dudes.'
  }, function (data) {
    console.log('Acknowledged', data)
  });
} else {
  socket.emit('createMessage', {
    from: 'Admin',
    text: 'Is this thing on?'
  }, function (data) {
    console.log('Acknowledged', data)
  });
}


$(document).ready(
  function () {
    const messageTextbox = $('[name=message]')
    //send button
    $('#message-form').submit(function (e) {
      e.preventDefault()
      socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
      }, function () {
        messageTextbox.val('')
      }
      );
    })
  }
)

