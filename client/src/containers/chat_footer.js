import React from 'react';

class ChatFooter extends React.Component{

  constructor(props){
    super(props)
    this.state = { message: ""}
  }

  handleChange(event){
    this.setState({
      message: event.target.value
    })
  }

  handleMessage(event){

    event.preventDefault();
    this.props.sendMessage(undefined, this.state.message)
    this.setState({ message: "" });

  }

  render(){
    return (
    <div className="chat__footer">
      <form id="message-form">
        <input name="message" onChange={this.handleChange.bind(this)}  value={this.state.message} type="text" placeholder="Message" autoFocus autoComplete="off" />
        <button onClick={this.handleMessage.bind(this)}>Send</button>
      </form>
    </div> )
  }
}

export default ChatFooter