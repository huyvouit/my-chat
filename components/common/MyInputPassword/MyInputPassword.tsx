import { FormItemStyle } from "utils/styled-constants";
import { Input } from "antd";
import { PasswordProps } from "antd/lib/input";
import React from "react";
import styles from './MyInputPassword.module.scss';

interface Props extends PasswordProps {
  className?: string;
  width100?: boolean;
  lightInput?: boolean;
  inputStyle?: FormItemStyle;
}

const MyInputPassword = React.forwardRef<any, Props>(({
  className,
  width100 = true,
  lightInput,
  inputStyle = FormItemStyle.Normal,
  ...props
}, ref) => {

  return (
    <Input.Password ref={ref} className={`${styles[`my-input-password`]} ${styles[`my-input-password--${inputStyle}`]
      } ${width100 ? styles[`my-input-password--max-width`] : ``
      }  ${lightInput ? styles[`my-input-password--light`] : ``
      } ${className}`}
      {...props}
    ></Input.Password>
  );
});

export default MyInputPassword;