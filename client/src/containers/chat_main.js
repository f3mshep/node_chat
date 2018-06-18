import React from 'react';
import io from 'socket.io-client';

import ChatMessages from './chat_messages'
import ChatFooter from './chat_footer'
import ChatSidebar from '../components/chat_sidebar'
import SignIn from '../containers/sign_in_container'

class ChatMain extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      signedIn: false,
      users: [],
      messages: [],
      clientSocket: null,
      username: null,
      token: null
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

  setToken(token){
    const socket = this.state.clientSocket;
    this.setState({token});
    localStorage.setItem('jwt', token)
    socket.emit('authenticate', token)
  }

  handleAuthentication(auth){
    this.setState({
      signedIn: true,
      username: auth.username
    })
  }

  handleRejection(){
    console.log('OOOOOH! Rejected!')
  }

  updateUsers(users){
    this.setState({users})
  }

  componentDidMount(){
    //set up socket
    const socket = io();
    this.setState({clientSocket: socket});

    socket.on('connect', () => {
      console.log('Connected to server')
      if(localStorage.jwt){
        this.setToken(localStorage.jwt)
      }
    });

    socket.on('authenticated', (auth)=>{
      this.handleAuthentication(auth)
      console.log('user authenticated')
      socket.on("newMessage", this.recieveMessage.bind(this));
      socket.on("updateUsers", this.updateUsers.bind(this));
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socket.on('rejected', this.handleRejection.bind(this))

  }

  render(){
    const chatPage = <div className="chat">
      <ChatSidebar users={this.state.users} />
      <div className="chat__main">
        <ChatMessages messages={this.state.messages} />
        <ChatFooter sendMessage={this.sendMessage.bind(this)} />
      </div>
    </div>;
    const signIn = <SignIn setToken={this.setToken.bind(this)}/>
    return this.state.signedIn ? chatPage : signIn
  }
}

export default ChatMain;