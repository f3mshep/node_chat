import React from 'react';
import io from 'socket.io-client';

import ChatMessages from './chat_messages'
import ChatFooter from './chat_footer'
import ChatSidebar from '../components/chat_sidebar'
import SignIn from '../components/sign_in_component'

class ChatMain extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      signedIn: false,
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

  handleSignIn(username, password){
    const socket = this.state.clientSocket;
    const request = {username, password};
    fetch("/users", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(request)
    })
    .then(response => {
      if(!response.ok){
        console.log(response)
      } else {
        return response.json()
      }
    })
    .then(token => {
      localStorage.setItem("jwt", token)
      socket.emit('authenticate', token)
    })
  }

  handleAuthentication(){
    this.setState({signedIn: true})
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
    });

    socket.on('authenticated', ()=>{
      this.handleAuthentication()
      console.log('user authenticated')
      socket.on("newMessage", this.recieveMessage.bind(this));
      socket.on("userJoin", this.updateUsers.bind(this));
    })

    socket.on('updateUsers', (users)=> {
      this.updateUsers(users)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

  }

  render(){
    const chatPage = <div className="chat">
      <ChatSidebar users={this.state.users} />
      <div className="chat__main">
        <ChatMessages messages={this.state.messages} />
        <ChatFooter sendMessage={this.sendMessage.bind(this)} />
      </div>
    </div>;
    const signIn = <SignIn handleSignIn={this.handleSignIn.bind(this)}/>
    return this.state.signedIn ? chatPage : signIn
  }
}

export default ChatMain;