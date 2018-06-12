import React from 'react';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      passwordConfirmation: ""
    }
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  handlePasswordConfirmationChange(event) {
    this.setState({
      passwordConfirmation: event.target.value
    })
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.passwordConfirmation !== this.state.password){
      console.log('passwords do not match')
      return false;
    }
    const request = { username: this.state.username, password: this.state.password };
    fetch("/users", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })
      .then(response => {
        if (!response.ok) {
          //TODO: err handle here (modal maybe?)
          console.log(response)
        } else {
          return response.json()
        }
      })
      .then(auth => {
        localStorage.setItem("jwt", auth.token)
        this.props.setToken(auth.token)
      }).catch(err => console.log('something went wrong:', err))
  }


  render() {
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
        <input onChange={this.handlePasswordConfirmationChange.bind(this)} placeholder="Password confirmation" type="password" value={this.state.passwordConfirmation} />
      </div>
      <div className="form-field">
        <button onClick={this.handleSubmit.bind(this)}>Join</button>
      </div>
      <div className="form-field">
        <a onClick={this.props.toggleSignUp}><p>Want to sign in?</p></a>
      </div>
    </form>);
  }
}

export default SignUpForm;