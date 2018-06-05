import React from 'react';
import moment from 'moment';

import ChatMessage from '../components/chat_message'

class ChatMessages extends React.Component{

  renderMessages(){
    return this.props.messages.map((message, index) =>
      <ChatMessage key={index} from={message.from} text={message.text} createdAt={moment(message.createdAt).format('h:mm a')} />
    );
  }

  render(){
    return <ol id="messages" className="chat__messages" >
      {this.renderMessages()}
    </ol>;
  }
}

export default ChatMessages;