import React from 'react';
import SignInForm from '../containers/sign_in_form';

const SignIn = (props) => (
  <div className="centered-form">
    <div className="centered-form__form">
      <SignInForm handleAccountCreation={props.handleAccountCreation} />
    </div>
  </div>
);

export default SignIn;