import React from 'react';
import moment from 'moment';

import ChatMessage from '../components/chat_message'

class ChatMessages extends React.Component{

  renderMessages(){
    return this.props.messages.map((message, index) =>
      <ChatMessage key={index} from={message.from} text={message.text} createdAt={moment(message.createdAt).format('h:mm a')} />
    );
  }

  scrollToBottom(){
    this.el.scrollIntoView({behavior: 'smooth'});
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  render(){
    return <ol id="messages" className="chat__messages" >
      {this.renderMessages()}
      <div ref={el => {this.el = el}}/>
    </ol>;
  }
}

export default ChatMessages;