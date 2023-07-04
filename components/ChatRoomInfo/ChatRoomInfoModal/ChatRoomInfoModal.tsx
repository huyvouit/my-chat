import React from "react";
import MyModal from "components/common/MyModal/MyModal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { roomActions } from "redux/slices/apiSlices/roomSlice";
import ChatRoomInfo from "../ChatRoomInfo";
import styles from "./ChatRoomInfoModal.module.scss";

const ChatRoomInfoModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    room: { isShowChatRoomInfo },
  } = useAppSelector((state) => state);

  return (
    <MyModal
      title="Chat Room Info"
      open={isShowChatRoomInfo}
      onCancel={() => dispatch(roomActions.setShowChatRoomInfo(false))}
      footer={null}
      className={styles["chat-room-info-modal"]}
    >
      <ChatRoomInfo className={styles["chat-room-info-modal__container"]}/>
    </MyModal>
  );
}

export default ChatRoomInfoModal;