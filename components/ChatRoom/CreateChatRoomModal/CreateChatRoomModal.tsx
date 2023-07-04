import React, { useState, useEffect } from "react";
import styles from "./CreateChatRoomModal.module.scss";
import MyModal from "components/common/MyModal/MyModal";
import MyButton from "components/common/MyButton/MyButton";
import { Button, Form, Input, notification, Space } from "antd";
import MyInput from "components/common/MyInput/MyInput";
import { ERoomType } from "utils/contants";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doGetListUser, doGetUserDetail } from "redux/asyncThunk/userAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { IResGetListUser, IResGetUserDetail, IUserModel } from "services/types/user";
import { doCreateRoom } from "redux/asyncThunk/roomAction";
import { useRouter } from "next/router";
import RoomUserList from "./RoomUserList/RoomUserList";
import ChosenUserItem from "./ChosenUserItem/ChosenUserItem";
import { roomActions } from "redux/slices/apiSlices/roomSlice";

const CreateChatRoomModal: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    user: { userInfo },
    room: { isShowCreateRoomModal, loadingCreateRoom }
  } = useAppSelector((state) => state);

  const [userList, setUserList] = useState<IUserModel[]>([]);
  const [chosenUsers, setChosenUsers] = useState<IUserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchUsers = (event: any) => {
    console.log(userInfo.id);
    dispatch(doGetListUser({ text: event.target.value, notIds: [userInfo.id] }))
      .then(unwrapResult)
      .then((res: IResGetListUser) => {
        setUserList(res.data);
      })
  };

  const handleAddChosenUser = (user: IUserModel | null) => {
    setChosenUsers(prev => {
      return [...prev, user];
    });
  };

  const handleRemoveChosenUser = (user: IUserModel | null) => {
    setChosenUsers(prev => {
      return prev.filter((chosenUser) => chosenUser.id !== user.id);
    });
  };

  const handleSubmit = async (values: any) => {
    if (chosenUsers.length === 0) {
      notification.error({
        message: "Please choose at least one user"
      });
      return;
    }
    const roomMembers = chosenUsers.map((user) => user.id);
    // Create new chat room
    dispatch(doCreateRoom({
      name: values.roomName,
      type: ERoomType.Contribute,
      users: roomMembers,
    }))
      .then(unwrapResult)
      .then((res) => {
        // dispatch(roomActions.setPushNewRoomToList(res?.data));
        router.push({
          query: { roomId: res?.data.id }
        }, undefined, { shallow: true });
        notification.success({ message: "Create new group chat successfully!" });
        dispatch(roomActions.setShowCreateRoomModal(false))
      })
  };

  useEffect(() => {
    setLoading(true);
    dispatch(doGetListUser({ notIds: [userInfo.id] }))
      .then(unwrapResult)
      .then((res: IResGetListUser) => {
        setUserList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      })
  }, []);

  return (
    <MyModal
      title="Create New Chat"
      open={isShowCreateRoomModal}
      onCancel={() => dispatch(roomActions.setShowCreateRoomModal(false))}
      footer={[
        <>
          <MyButton key="cancel" onClick={() => dispatch(roomActions.setShowCreateRoomModal(false))}>
            Cancel
          </MyButton>
          <MyButton
            key="submit"
            type="primary"
            htmlType="submit"
            form="form-create-chat-room"
            disabled={chosenUsers.length === 0}
            loading={loadingCreateRoom}
          >
            Create Room
          </MyButton>
        </>
      ]}
      className={`${styles[`create-chat-room-modal`]}`}
    >
      <Form form={form} layout="vertical" name="form-create-chat-room" onFinish={handleSubmit} className={`${styles[`create-chat-room-modal__form`]}`}>
        <Form.Item name="roomMembers" className={`${styles[`create-chat-room-modal__form-item`]}`}>
          <MyInput
            placeholder="Search by name or email..."
            onChange={handleSearchUsers}
          />
        </Form.Item>
        {chosenUsers && chosenUsers.length > 0 && (
          <>
            <Form.Item name="roomName" label="Room name" 
              className={`${styles[`create-chat-room-modal__form-item`]}`}
            >
              <MyInput placeholder="Enter room name" />
            </Form.Item>
            <div className={styles["create-chat-room-modal__chosen-user-list"]}>
              {chosenUsers.map((chosenUser) => (
                <ChosenUserItem key={chosenUser.id} 
                  roomUserData={chosenUser} 
                  handleRemoveChosenUser={handleRemoveChosenUser} 
                />
              ))}
            </div>
          </>
        )}
        {/* List user */}
        <div className={styles["create-chat-room-modal__list-user"]} 
          style={{ height: chosenUsers.length > 0 ? "230px" : "330px" }}
        >
          <RoomUserList
            roomUserList={userList}
            chosenUsers={chosenUsers}
            onAddChosenUser={handleAddChosenUser}
            onRemoveChosenUser={handleRemoveChosenUser}
            hasDirectMessage
          />
        </div>
      </Form>
    </MyModal>
  );
}

export default CreateChatRoomModal;