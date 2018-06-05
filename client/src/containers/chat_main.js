import React from 'react';
import io from 'socket.io-client';

import ChatMessages from './chat_messages'
import ChatFooter from './chat_footer'
import ChatSidebar from '../components/chat_sidebar'

class ChatMain extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      users: [],
      messages: [],
      clientSocket: null
    };
  }

  sendMessage(user, message){
    const socket = this.state.clientSocket
    socket.emit('createMessage', {
      from: 'User',
      text: message
    }, function () {
      console.log('Message sent')
    }
    );
  }

  recieveMessage(message){
    let currentMessages = this.state.messages
    currentMessages.push(message)
    this.setState({messages: currentMessages})
  }

  componentDidMount(){
    //set up socket
    const socket = io();
    this.setState({clientSocket: socket});
    socket.on('connect', () => {
      console.log('Connected to server')
    });

    if (new Date().getUTCDay() === 3) {
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

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socket.on("newMessage", this.recieveMessage.bind(this));

  }

  render(){


    return(
      <div className="chat">
        <ChatSidebar />
        <div className="chat__main">
          <ChatMessages messages={this.state.messages} />
          <ChatFooter sendMessage={this.sendMessage.bind(this)} />
        </div>
      </div>)
  }
}

export default ChatMain;