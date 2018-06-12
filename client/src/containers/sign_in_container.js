import React from 'react';
import SignInForm from '../containers/sign_in_form';
import SignUpForm from '../containers/sign_up_form';

class SignIn extends React.Component{
  constructor(props){
    super(props)
    this.state = {showSignUp: false}
  }

  toggleSignUp(){
    if (this.state.showSignUp){
      this.setState({showSignUp:false})
    } else {
      this.setState({showSignUp: true})
    }
  }

  render(){
    return <div className="centered-form">
        <div className="centered-form__form">
          {this.state.showSignUp ? (
            <SignUpForm
              toggleSignUp={this.toggleSignUp.bind(this)}
              setToken={this.props.setToken}
            />
          ) : (
            <SignInForm
              toggleSignUp={this.toggleSignUp.bind(this)}
              setToken={this.props.setToken}
            />
          )}
        </div>
      </div>;
  }
}



export default SignIn;