import { TextAreaType } from "utils/contants";
import Input, { TextAreaProps } from "antd/lib/input";
import React from "react";
import styles from './MyTextArea.module.scss';

const { TextArea} = Input;

interface Props extends TextAreaProps {
  className?: string;
  myType?: TextAreaType;
}

const MyTextArea = React.forwardRef<any, Props>(({
  className,
  myType = TextAreaType.Border,
  ...props
}, ref) => {

  return (
    <TextArea {...props} className={`${styles[`my-textarea`]} ${styles[`my-textarea--${myType}`]} ${props.showCount ? `` : styles[`my-textarea--not-count`]
      } ${className}`}
      ref={ref}
    ></TextArea>
  );
});

export default MyTextArea;