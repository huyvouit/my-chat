import Link from 'next/link';
import React, { HTMLAttributeAnchorTarget, ReactNode, useMemo } from 'react';
import { Spinner } from 'react-bootstrap';
import { ButtonSize, ButtonStyle, ButtonTextAlign, ButtonType } from 'utils/styled-constants';
import styles from './Button.module.scss';

interface IButton {
  children?: any;
  className?: string;
  classNameButton?: string;
  type?: ButtonType;
  value?: string;
  leftIcon?: ReactNode;
  styleButton?: ButtonStyle | Array<ButtonStyle>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  size?: ButtonSize;
  noStyle?: boolean;
  noBorder?: boolean;
  maxWidth?: boolean;
  loading?: boolean;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  isMaxRadius?: boolean;
  fitHeight?: boolean;
  textAlign?: ButtonTextAlign;
  noAnimation?: boolean;
}

const Button = React.forwardRef<any, IButton>(
  (
    { 
      children, 
      className, 
      classNameButton,
      type, 
      value, 
      leftIcon,
      styleButton, 
      onClick,
      disabled,
      size,
      noStyle,
      noBorder,
      maxWidth,
      loading,
      href,
      target,
      isMaxRadius = true,
      fitHeight,
      textAlign,
      noAnimation = false,
    },
    ref,
  ) => {

    const onClickChild = (e: any) => {
      if(e.target.parentNode && e.target.parentNode.click) {
        e.stopPropagation();
        e.preventDefault();
        e.target.parentNode.click();
      }
    }
    
    const classNameStyle = useMemo(() => {
      let temp = ``;

      if (styleButton) {
        if(typeof(styleButton) === 'string') {
          temp += ` ${styles[`button--${styleButton as string}`]} `;
        } else {
          temp += styleButton.map(item => {
            return  ` ${styles[`button--${item as string}`]} `;
          }).join(" ");
        }
      }
  
      if(size) {
        temp += ` ${styles[`button--${size as string}`]} `;
      }

      return temp;
    }, [styleButton, size]);

    const ButtonRender = () => {
      return (
        <button
          className={`${styles[`button`]} ${classNameStyle} ${
            disabled || loading ? styles[`button--disabled`] : ``
          } ${
            noStyle ? styles[`button--no-style`] : ``
          } ${
            noBorder ? styles[`button--no-border`] : ``
          } ${
            maxWidth ? styles[`button--max-width`] : ``
          } ${
            fitHeight ? styles[`button--fit-height`] : ``
          } ${
            isMaxRadius ? styles[`button--min-radius`] : ``
          } ${
            noAnimation ? styles[`button--no-animation`] : ``
          } ${className}`}
          ref={ref}
          type={type}
          value={value}
          onClick={onClick}
          disabled={disabled || loading}
        >
          <div className={`${styles['button__children']} ${styles[`button__children--${textAlign as string}`]} ${classNameButton}`} onClick={onClickChild}>
            {loading && <Spinner animation="border" size='sm' className={`${styles['button__spinner']}`} />}
            {!loading && leftIcon && (
              <>{leftIcon}</>
            ) }
            {children}
          </div>
        </button>
      );
    }

    return (
      <>
        {!!href ? (
          <Link href={href} className={`${styles['button__link']} ${
              maxWidth ? styles[`button__link--max-width`] : ``
            }`} target={target}>
            <ButtonRender></ButtonRender>
          </Link>
        ) : (
          <ButtonRender></ButtonRender>
        )}
      </>
    );
  },
);

export default Button;