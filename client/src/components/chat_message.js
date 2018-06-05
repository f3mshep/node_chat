import React from 'react';

const ChatMessage = (props) => {
  return (
    <li className="message">
      <div className="message__title">
        <h4>{props.from}</h4>
        <span>{props.createdAt}</span>
      </div>
      <div className="message__body">
        <p>{props.text}</p>
      </div>
    </li>
  )
}

export default ChatMessage;