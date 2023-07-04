import { FormItemStyle } from "utils/styled-constants";
import { Input, InputProps } from "antd";
import React, { useMemo } from "react";
import styles from './MyInput.module.scss';

interface Props extends InputProps {
  width100?: boolean;
  lightInput?: boolean;
  inputStyle?: FormItemStyle;
}

const MyInput = React.forwardRef<any, Props>(({
  width100 = true,
  lightInput,
  inputStyle = FormItemStyle.Normal,
  ...props
}, ref) => {

  const isDefault = useMemo(() => {
    if (!!!props.addonBefore && !!!props.addonAfter) {
      return true;
    }
    return false;
  }, [props]);

  return (
    <Input ref={ref}
      {...props}
      className={`${isDefault ? styles[`my-input--default`] : ``
        } ${props.addonBefore ? styles[`my-input--before`] : ``
        } ${props.addonAfter ? styles[`my-input--after`] : ``
        } ${styles[`my-input--${inputStyle}`]} ${width100 ? styles[`my-input--max-width`] : ``
        } ${lightInput ? styles[`my-input--light`] : ``
        } ${props.className}`}
    ></Input>
  );
});

export default MyInput;
