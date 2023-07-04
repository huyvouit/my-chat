import React from "react";
import styles from './SignUp.module.scss';
import SignUpForm from "./SignUpForm/SignUpForm";


function SignUpScreen() {

  return (
    <div className={`${styles[`signup`]}`}>
      <div className={`${styles[`signup__container`]}`}>
        <SignUpForm className={`${styles[`signup__form`]}`}></SignUpForm>
        {/* <div className={`${styles[`signup__image`]}`}></div> */}
      </div>
    </div>
  );
}

export default SignUpScreen;