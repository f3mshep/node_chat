const socket = io();

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

socket.emit('createMessage', {
  from: 'JimmyHere',
  text: 'It is Wednesday my dudes.'
}, function (data) {
  console.log('Acknowledged', data)
});

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

