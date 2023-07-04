import React, { useMemo, useState } from "react";
import styles from "./MemberItem.module.scss";
import { IUserModel } from "services/types/user";
import { Avatar, Dropdown, MenuProps, notification } from "antd";
import { AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
import { ERoomRole, ERoomType, ROOM_ROLE } from "utils/contants";
import { IUsersInRoom } from "services/types/room";
import { SlOptions } from "react-icons/sl";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { doCreateRoom, doFindRoomChatInDatabase } from "redux/asyncThunk/roomAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import { roomActions } from "redux/slices/apiSlices/roomSlice";
import RemoveMemberModal from "../RemoveMemberModal/RemoveMemberModal";
import { HiUserRemove } from "react-icons/hi";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import useResizeScreen from "hooks/useResizeScreen";

type MyItemMenu = ItemType & {
  isShowItem: boolean | string,
};

interface Props {
  memberData: IUsersInRoom;
  isAdmin?: boolean;
}

const MemberItem: React.FC<Props> = ({
  memberData,
  isAdmin
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isMobile } = useResizeScreen();
  const {
    user: { userInfo },
    room: { chatRoomList: { data, loading, pagination } },
  } = useAppSelector((state) => state);

  const [isShowRemoveMember, setIsShowRemoveMember] = useState(false);

  const handleCreatePrivateRoom = (e: any) => {
    e.stopPropagation();
    // Create new chat room
    dispatch(doCreateRoom({
      type: ERoomType.Private,
      users: [memberData.id],
    }))
      .then(unwrapResult)
      .then((res) => {
        router.push({
          query: { roomId: res?.data.id }
        }, undefined, { shallow: true });

        dispatch(roomActions.setShowChatRoomInfo(false));
      })
  };

  const memberActionItems: MyItemMenu[] = useMemo(
    () => [
      {
        label: (
          <div onClick={handleCreatePrivateRoom}>
            Message
          </div>
        ),
        key: "message",
        icon: <AiOutlineMessage size={20} />,
        isShowItem: userInfo.id !== memberData.id,
      },
      {
        label: (
          <div onClick={() => setIsShowRemoveMember(true)}>
            Remove member
          </div>
        ),
        key: "Remove member",
        icon: <MdOutlinePersonRemoveAlt1 size={20} />,
        isShowItem: isAdmin && userInfo.id !== memberData.id,
      },
      {
        label: (
          <div onClick={() => setIsShowRemoveMember(true)}>
            Leave room
          </div>
        ),
        key: "Leave room",
        icon: <AiOutlineLogout size={20} />,
        isShowItem: userInfo.id === memberData.id,
      },
    ],
    [userInfo, memberData]
  );

  return (
    <div className={`${styles[`member-item`]}`}>
      <div className={styles["member-item__container"]}>
        <div className={styles["member-item__avatar"]}>
          <Avatar size={40}>{memberData.name.substring(0, 2)}</Avatar>
        </div>
        <div className={styles["member-item__info"]}>
          <div className={styles["member-item__name"]}>
            {memberData.name}
          </div>
          <div className={styles["member-item__role"]}>
            {ROOM_ROLE[memberData.role]}
          </div>
        </div>
        <div className={styles["member-item__actions"]}>
          <Dropdown
            menu={{ items: memberActionItems.filter((item: MyItemMenu) => item?.isShowItem) }} placement="bottomRight"
            autoFocus={false}
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
            overlayClassName={styles["member-item__dropdown"]}
          >
            <SlOptions size={14} />
          </Dropdown>
        </div>
      </div>

      {isShowRemoveMember && (
        <RemoveMemberModal
          show={isShowRemoveMember}
          setShow={setIsShowRemoveMember}
          member={memberData}
          isLeave={userInfo.id === memberData.id}
        />
      )}
    </div>
  );
}

export default MemberItem;