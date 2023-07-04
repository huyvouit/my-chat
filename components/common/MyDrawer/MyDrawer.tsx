import { Drawer, DrawerProps } from "antd";
import { ReactNode } from "react";
import styles from "./MyDrawer.module.scss";

interface Props extends DrawerProps {
  keyDrawer?: string;
  children?: ReactNode;
}

const MyDrawer: React.FC<Props> = ({
  keyDrawer,
  children,
  ...props
}) => {
  return (
    <Drawer {...props}
      className={`${styles[`my-drawer`]} ${props.className}`}
      key={keyDrawer}
      width="100vw"
      height="100vh"
      headerStyle={{ display: "none" }}
    >
      {children}
    </Drawer>
  );
}

export default MyDrawer;