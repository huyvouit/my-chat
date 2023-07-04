import React from "react";
import styles from './Login.module.scss';
import LoginForm from "./LoginForm/LoginForm";

const LoginScreen: React.FC = () => {

  return (
    <div className={`${styles[`login`]}`}>
      <div className={`${styles[`login__container`]}`}>
        <LoginForm className={`${styles[`login__form`]}`}></LoginForm>
      </div>
    </div>
  );
}

export default LoginScreen;