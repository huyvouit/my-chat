import { Drawer } from "antd";
import styles from "./MessageBoxDrawer.module.scss";
import MessageBox from "../MessageBox/MessageBox";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useResizeScreen from "hooks/useResizeScreen";
import MyDrawer from "components/common/MyDrawer/MyDrawer";

const MessageBoxDrawer: React.FC = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const { isMobile } = useResizeScreen();

  const [isShowMessageBox, setIsShowMessageBox] = useState<boolean>(false);

  const handleCloseDrawer = () => {
    delete router.query.roomId;
    setIsShowMessageBox(false);
    router.push({ query: router.query }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (roomId) {
      setIsShowMessageBox(true);
    } else {
      setIsShowMessageBox(false);
    }
  }, [roomId]);

  return (
    <MyDrawer
      open={isMobile && isShowMessageBox}
      onClose={handleCloseDrawer}
      className={`${styles[`message-box-drawer`]}`}
    >
      <div className={`${styles[`message-box-drawer__container`]}`}>
        <MessageBox />
      </div>
    </MyDrawer>
  );
};

export default MessageBoxDrawer;
