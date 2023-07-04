import React from "react";
import { Spin } from "antd";
import styles from "./loading.module.scss";
import { Logo } from "../Logo/Logo";
// import Logo from "assets/img/logofull.svg";

interface ILoading {
  isShow?: boolean;
  showLogo?: boolean;
}

const Loading = React.memo<ILoading>(({ isShow, showLogo = true }) => {
  return (
    <div className={`${styles[`loading`]} ${isShow ? styles[`loading--show`] : ``}`}>
      <div className={`${styles[`loading__container`]}`}>
        <div className={`${styles[`loading__spinner`]}`}>
          <Spin size="large" />
        </div>
        {showLogo && <Logo />}
      </div>
    </div>
  );
});

export default Loading;