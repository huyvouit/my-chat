import { PositionSpinner } from "utils/contants";
import { Spin } from "antd";
import { ReactNode } from "react";
import styles from './MySpinner.module.scss';

interface Props {
  id?: string;
  className?: string;
  classNameContainer?: string;
  children?: ReactNode;
  loading?: boolean;
  fitcontent?: boolean;
  positionSpinner?: PositionSpinner;
}

const MySpinner: React.FC<Props> = ({
  id,
  className,
  classNameContainer,
  children,
  loading,
  fitcontent,
  positionSpinner,
}) => {

  return (
    <div className={`${styles[`my-spinner`]} ${fitcontent ? styles[`my-spinner--fit-content`] : ``
      } ${className}`}
      id={id}
    >
      <div className={`${styles[`my-spinner__container`]} ${classNameContainer}`}>
        {loading && (
          <div className={`${styles[`my-spinner__spin`]} ${styles[`my-spinner__spin--${positionSpinner}`]}`}>
            <Spin className={`${styles[`icon`]}`} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default MySpinner;