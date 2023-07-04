import { Button, ButtonProps } from "antd";
import React from "react";
import { ReactNode } from "react";
import styles from "./MyBUtton.module.scss";

interface Props extends ButtonProps {
  children?: ReactNode;
  maxWidth?: boolean;
  className?: string;
  noPadding?: boolean;
  fitContent?: boolean;
}

const MyButton = React.forwardRef<any, Props>(({ children, maxWidth, className, noPadding, ...otherProps }, ref) => {
  return (
    <Button
      ref={ref}
      className={`${styles[`my-button`]} ${maxWidth ? styles[`my-button--max-width`] : 1} ${otherProps.ghost ? styles[`my-button--bg-white`] : ``
        } ${noPadding ? styles[`my-button--no-padding`] : ``} ${className}`}
      {...otherProps}
    >
      {children}
    </Button>
  );
});

export default MyButton;