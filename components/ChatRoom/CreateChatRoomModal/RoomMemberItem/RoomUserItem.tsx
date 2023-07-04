import React from "react";
import styles from "./RoomUserItem.module.scss";
import { IUserModel } from "services/types/user";
import { Avatar, Checkbox, notification } from "antd";
import { AiOutlineMessage } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doCreateRoom, doFindRoomChatInDatabase } from "redux/asyncThunk/roomAction";
import { ERoomType } from "utils/contants";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import { roomActions } from "redux/slices/apiSlices/roomSlice";


interface Props {
  roomUserData: IUserModel;
  chosenUsers: IUserModel[] | null;
  onAddChosenUser: (user: IUserModel | null) => void;
  onRemoveChosenUser: (user: IUserModel | null) => void;
  hasDirectMessage?: boolean;
}

const RoomUserItem: React.FC<Props> = ({
  roomUserData,
  chosenUsers,
  onAddChosenUser,
  onRemoveChosenUser,
  hasDirectMessage = false,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    room: { chatRoomList: { data, loading, pagination } },
  } = useAppSelector((state) => state);

  const isChosenUser = chosenUsers.map(user => user.id).includes(roomUserData.id);

  const handleChooseUser = () => {
    if (!!isChosenUser) {
      onRemoveChosenUser(roomUserData);
      return;
    }
    onAddChosenUser(roomUserData);
  };

  const handleCreatePrivateRoom = (e: any) => {
    e.stopPropagation();
    // Create new chat room
    dispatch(doCreateRoom({
      type: ERoomType.Private,
      users: [roomUserData.id],
    }))
      .then(unwrapResult)
      .then((res) => {
        router.push({
          query: { roomId: res?.data.id }
        }, undefined, { shallow: true });

        dispatch(roomActions.setShowCreateRoomModal(false));
      })
  };

  return (
    <div className={`${styles[`room-user-item`]} ${isChosenUser ? styles[`room-user-item--active`] : ``}`}
    >
      <div className={styles["room-user-item__container"]} onClick={handleChooseUser}>
        <div className={styles["room-user-item__avatar"]}>
          <Avatar size={40}>{roomUserData.name.substring(0, 2)}</Avatar>
        </div>
        <div className={styles["room-user-item__info"]}>
          <div className={styles["room-user-item__name"]}>
            {roomUserData.name}
          </div>
          <div className={styles["room-user-item__email"]}>
            {roomUserData.email}
          </div>
        </div>
        <div className={styles["room-user-item__actions"]}>
          {hasDirectMessage && <AiOutlineMessage size={20} onClick={handleCreatePrivateRoom} />}
          <Checkbox checked={isChosenUser}></Checkbox>
        </div>
      </div>
    </div>
  );
}

export default RoomUserItem;