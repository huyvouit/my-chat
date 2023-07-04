import React from "react";
import styles from './UnAuthLayout.module.scss';

interface IUnAuthLayout {
  Component: any,
  pageProps: any;
}

const UnAuthLayout: React.FC<IUnAuthLayout> = ({
  Component,
  pageProps
}) => {
  return (
    <div className={`${styles['unauth-layout']}`}>
      <Component {...pageProps} />
    </div>
  )
}

export default UnAuthLayout;