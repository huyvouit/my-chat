import React, { useState, useEffect, useMemo } from "react";
import styles from "./AddMemberModal.module.scss";
import MyModal from "components/common/MyModal/MyModal";
import MyButton from "components/common/MyButton/MyButton";
import { Form, notification } from "antd";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doGetListUser } from "redux/asyncThunk/userAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { IResGetListUser, IUserModel } from "services/types/user";
import RoomUserList from "components/ChatRoom/CreateChatRoomModal/RoomUserList/RoomUserList";
import ChosenUserItem from "components/ChatRoom/CreateChatRoomModal/ChosenUserItem/ChosenUserItem";
import MyInput from "components/common/MyInput/MyInput";
import { doAddRoomMember } from "redux/asyncThunk/roomAction";

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
}


const AddMemberModal: React.FC<Props> = ({
  show,
  setShow
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const {
    user: { userInfo },
    room: { activeChatRoomData }
  } = useAppSelector((state) => state);

  const [userList, setUserList] = useState<IUserModel[]>([]);
  const [chosenUsers, setChosenUsers] = useState<IUserModel[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchUsers = (event: any) => {
    dispatch(doGetListUser({ text: event.target.value, notIds: [...memberIds] }))
      .then(unwrapResult)
      .then((res: IResGetListUser) => {
        setUserList(res.data);
      })
  };

  const handleAddChosenUser = (user: IUserModel | null) => {
    setChosenUsers([...chosenUsers, user]);
  };

  const handleRemoveChosenUser = (user: IUserModel | null) => {
    setChosenUsers(chosenUsers.filter((chosenUser) => chosenUser.id !== user.id));
  };

  const handleSubmit = async () => {
    const newMembers = chosenUsers.map((user) => user.id);

    // Add member to room
    dispatch(doAddRoomMember({ roomId: activeChatRoomData.id, userIds: newMembers }))
      .then(unwrapResult)
      .then(() => {
        setShow(false);
      });
  };

  const memberIds = useMemo(() => {
    return activeChatRoomData?.users.map((member) => member.id) || [];
  }, [activeChatRoomData]);

  useEffect(() => {
    setLoading(true);
    dispatch(doGetListUser({ notIds: [...memberIds] }))
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
      title="Add member"
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
            form="form-add-member-modal"
            disabled={chosenUsers.length === 0}
          >
            Add member
          </MyButton>
        </>
      ]}
      className={`${styles[`add-member-modal`]}`}
    >
      <Form form={form} layout="vertical" name="form-add-member-modal" onFinish={handleSubmit} className={`${styles[`add-member-modal__form`]}`}>
        <Form.Item name="roomMembers" className={`${styles[`add-member-modal__form-item`]}`}>
          <MyInput
            placeholder="Search by name or email..."
            onChange={handleSearchUsers}
          />
        </Form.Item>
        {chosenUsers && chosenUsers.length > 0 ? (
          <>
            <div className={styles["add-member-modal__chosen-user-list"]}>
              {chosenUsers.map((chosenUser) => (
                <ChosenUserItem key={chosenUser.id} roomUserData={chosenUser} handleRemoveChosenUser={handleRemoveChosenUser} />
              ))}
            </div>
          </>
        ) : (
          <div className={styles["add-member-modal__no-chosen-user"]}>
            <p>No user chosen</p>
          </div>
        )}

        {/* List user */}
        <div className={styles["add-member-modal__list-user"]}>
          <RoomUserList
            roomUserList={userList}
            chosenUsers={chosenUsers}
            onAddChosenUser={handleAddChosenUser}
            onRemoveChosenUser={handleRemoveChosenUser}
          />
        </div>
      </Form>
    </MyModal>
  );
}

export default AddMemberModal;