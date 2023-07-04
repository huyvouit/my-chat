import MySpinner from "components/common/MySpinner/MySpinner";
import { useRouter } from "next/router";
import React from "react";
import styles from "./MessageBox.module.scss";
import MessageBoxHeader from "./MessageBoxHeader/MessageBoxHeader";
import MessageBoxInput from "./MessageBoxInput/MessageBoxInput";
import MessageBoxList from "./MessageBoxList/MessageBoxList";
import { useAppSelector } from "redux/hooks";

interface Props {
  className?: string;
  classNameSearch?: string;
}

const MessageBox: React.FC<Props> = ({
  className,
}) => {
  const router = useRouter();
  const {
    message: {
      messageByRoomList: {
        loading
      }
    },
    room: { activeChatRoomData }
  } = useAppSelector((state) => state);

  const { roomId } = router.query;

  return (
    <MySpinner className={`${styles["message-box"]} ${className}`}
      classNameContainer={`${styles["message-box__container"]}`}
      loading={loading}
    >
      {!!Object.keys(activeChatRoomData || {}).length ? (
        <>
          <MessageBoxHeader />
          <MessageBoxList />
          <MessageBoxInput />
        </>
      ) : <></>}
    </MySpinner>
  );
};

export default MessageBox;
