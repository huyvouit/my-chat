import React from "react";
import Header from "../../Header/Header";
import styles from './AuthLayout.module.scss';

interface IAuthLayout {
  Component: any,
  pageProps: any;
}

const AuthLayout: React.FC<IAuthLayout> = ({
  Component,
  pageProps
}) => {
  return (
    <div className={`${styles['auth-layout']}`}>
      <Header></Header>
      <Component {...pageProps} />
    </div>
  )
}

export default AuthLayout;