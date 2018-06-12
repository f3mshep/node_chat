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

  handleSubmit(event) {
    event.preventDefault();
    const request = { username: this.state.username, password: this.state.password };
    fetch("/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })
      .then(response => {
        if (!response.ok) {
          //TODO: err handle here (modal maybe?)
          console.log(response);
        } else {
          return response.json();
        }
      })
      .then(auth => {
        localStorage.setItem("jwt", auth.token);
        this.props.setToken(auth.token);
      }).catch(err => console.log("something went wrong:", err));
  }

  // handleSubmit(event){
  //   event.preventDefault();
  //   this.props.handleAccountCreation(this.state.username, this.state.password)
  // }

  render(){
    return <form>
        <div className="form-field">
          <h3>Welcome to NodeChat</h3>
        </div>
        <div className="form-field">
          <input onChange={this.handleUsernameChange.bind(this)} placeholder="User name" type="text" value={this.state.username} />
        </div>
        <div className="form-field">
          <input onChange={this.handlePasswordChange.bind(this)} placeholder="Password" type="password" value={this.state.password} />
        </div>
        <div className="form-field">
          <button onClick={this.handleSubmit.bind(this)}>Sign in</button>
        </div>
        <div className="form-field">
          <a onClick={this.props.toggleSignUp}><p>Want to join?</p></a>
        </div>
      </form>;
  }
}

export default SignInForm;