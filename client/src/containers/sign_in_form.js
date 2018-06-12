import React from 'react';

class SignInForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  handlePasswordChange(event){
    this.setState({
      password: event.target.value
    })
  }

  handleUsernameChange(event){
    this.setState({
      username: event.target.value
    })
  }



  handleSubmit(event){
    event.preventDefault();
    this.props.handleAccountCreation(this.state.username, this.state.password)
  }

  render(){
    return (<form>
      <div className="form-field">
        <h3>Join the discussion</h3>
      </div>
      <div className="form-field">
        <input onChange={this.handleUsernameChange.bind(this)} placeholder="User name" type="text" value={this.state.username} />
      </div>
      <div className="form-field">
        <input onChange={this.handlePasswordChange.bind(this)} placeholder="Password" type="password" value={this.state.password} />
      </div>
      <div className="form-field">
        <button onClick={this.handleSubmit.bind(this)}>Join</button>
      </div>
    </form>);
  }
}

export default SignInForm;