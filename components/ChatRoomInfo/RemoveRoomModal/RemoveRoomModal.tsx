import React from "react";
import MyModal from "components/common/MyModal/MyModal";
import MyButton from "components/common/MyButton/MyButton";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doDeleteRoom } from "redux/asyncThunk/roomAction";
import { IUsersInRoom } from "services/types/room";
import { unwrapResult } from "@reduxjs/toolkit";
import styles from "./RemoveRoomModal.module.scss";
import { ERoomRole } from "utils/contants";
import { roomActions } from "redux/slices/apiSlices/roomSlice";
import { useRouter } from "next/router";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  member?: IUsersInRoom;
  isLeave?: boolean;
}

const RemoveRoomModal: React.FC<Props> = ({
  show,
  setShow,
 }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user: { userInfo },
    room: { activeChatRoomData, isLoadingDetail, chatRoomList }
  } = useAppSelector((state) => state);

  const handleRemoveRoom = () => {
    console.log("handleRemoveRoom");
    dispatch(doDeleteRoom({ id: activeChatRoomData.id }))
      .then(unwrapResult)
      .then((res) => {
        const removeRoomIndex = chatRoomList.data.findIndex(a => a.id === res.data);
        dispatch(roomActions.setRemoveRoom(activeChatRoomData));
        router.push({ query:  { roomId: chatRoomList.data[removeRoomIndex - 1]?.id || chatRoomList.data[removeRoomIndex + 1]?.id } }, undefined, { shallow: true });
        setShow(false);
      })
  };

  return (
    <MyModal
      title="Remove room"
      open={show}
      onCancel={() => setShow(false)}
      footer={[
        <>
          <MyButton key="cancel" onClick={() => setShow(false)}>
            Cancel
          </MyButton>
          <MyButton
            key="submit"
            type="primary"
            htmlType="submit"
            onClick={handleRemoveRoom}
            loading={isLoadingDetail}
          >
            Confirm
          </MyButton>
        </>
      ]}
    >
      <div className={`${styles[`remove-room-modal__content`]}`}>
        <p>Are you sure you want to remove this room?</p>
      </div>
    </MyModal>
  );
}

export default RemoveRoomModal;