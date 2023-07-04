import { CSSProperties, ReactNode } from 'react';
import styles from './LineThreeDots.module.scss';


interface Props {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  numberLine?: number;
  onClick?: () => void;
}

const LineThreeDots: React.FC<Props> = ({
  className,
  children,
  style,
  numberLine,
  onClick,
}) => {

  return (
    <div className={`${styles[`line-three-dots`]} ${styles[`line-three-dots--line-${numberLine}`]
      } ${className}`}
      style={style}
      onClick={() => onClick && onClick()}
    >{children}</div>
  );
}

export default LineThreeDots;