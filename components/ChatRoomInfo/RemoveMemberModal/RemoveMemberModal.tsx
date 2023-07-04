import React from "react";
import MyModal from "components/common/MyModal/MyModal";
import MyButton from "components/common/MyButton/MyButton";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doRemoveRoomMember } from "redux/asyncThunk/roomAction";
import { IUsersInRoom } from "services/types/room";
import { unwrapResult } from "@reduxjs/toolkit";
import styles from "./RemoveMemberModal.module.scss";
import { ERoomRole } from "utils/contants";
import { roomActions } from "redux/slices/apiSlices/roomSlice";
import { useRouter } from "next/router";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  member?: IUsersInRoom;
  isLeave?: boolean;
}

const RemoveMemberModal: React.FC<Props> = ({
  show,
  setShow,
  member,
  isLeave
 }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    user: { userInfo },
    room: { activeChatRoomData, isLoadingDetail, chatRoomList }
  } = useAppSelector((state) => state);

  const handleRemoveMember = () => {
    dispatch(doRemoveRoomMember({ roomId: activeChatRoomData.id, userIds: [member.id]}))
      .then(unwrapResult)
      .then((res) => {
        const admin = activeChatRoomData.users.find(a => a.role === ERoomRole.Admin);
        if (userInfo.id !== admin.id) {
          const removeRoomIndex = chatRoomList.data.findIndex(a => a.id === res.data.id);
          dispatch(roomActions.setRemoveRoom(activeChatRoomData));
          router.push({ query:  {
            roomId: chatRoomList.data[removeRoomIndex - 1]?.id || chatRoomList.data[removeRoomIndex + 1]?.id } }, 
          undefined, { shallow: true });
        }
        setShow(false);
      })
  };

  return (
    <MyModal
      title={isLeave ? "Leave room" : "Remove member from room"}
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
            onClick={handleRemoveMember}
            loading={isLoadingDetail}
          >
            Confirm
          </MyButton>
        </>
      ]}
    >
      <div className={`${styles[`remove-member-modal__content`]}`}>
        {isLeave ?
          "You not be able to send or receive new messages anymore and everyone in the room will be notified."
          : "Are you sure you want to remove this member from the room chat? They will not be able to send or receive new messages anymore."
        }
      </div>
    </MyModal>
  );
}

export default RemoveMemberModal;