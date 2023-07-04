
import MyButton from "components/common/MyButton/MyButton";
import { MdPeopleAlt } from "react-icons/md";
import { IUsersInRoom } from "services/types/room";
import AddMemberModal from "../AddMemberModal/AddMemberModal";
import MemberItem from "../MemberItem/MemberItem";
import styles from "./MemberList.module.scss";
import { useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { ERoomRole } from "utils/contants";
import { useAppSelector } from "redux/hooks";
import RemoveRoomModal from "../RemoveRoomModal/RemoveRoomModal";
import { HiTrash } from "react-icons/hi";

interface Props {
  memberList: IUsersInRoom[];
}

const MemberList: React.FC<Props> = ({
  memberList
}) => {
  const {
    user: { userInfo },
  } = useAppSelector((state) => state);

  const [isShowAddMember, setIsShowAddMember] = useState<boolean>(false);
  const [isShowRemoveRoom, setIsShowRemoveRoom] = useState<boolean>(false);

  const isAdmin = useMemo(() => {
    return memberList?.find(a => a.id === userInfo?.id)?.role === ERoomRole.Admin;
  }, [memberList]);

  return (
    <div className={styles["member-list"]}>
      <div className={styles["member-list__container"]}>
        <div className={styles["member-list__title"]}>
          <div className={styles["member-list__title-name"]}>
            <MdPeopleAlt size={20} />
            <span>Member</span>
          </div>
          <div className={styles["member-list__title-number"]}>({memberList?.length})</div>
        </div>
        <div className={styles["member-list__list"]}>
          <div className={styles["member-list__list-item"]}>
            {memberList?.map((member) => (
              <MemberItem key={member.id} memberData={member} isAdmin={isAdmin} />
            ))}
          </div>
          <div className={styles["member-list__action-btn"]} onClick={() => setIsShowAddMember(true)}>
            <AiFillPlusCircle size={36} />
            <span>Add member</span>
          </div>
          {isAdmin && (
            <div className={styles["member-list__action-btn"]} onClick={() => setIsShowRemoveRoom(true)}>
              <HiTrash size={36} />
              <span>Remove room</span>
            </div>
          )}
        </div>
      </div>

      {isShowAddMember && (
        <AddMemberModal show={isShowAddMember} setShow={setIsShowAddMember}/>
      )}
      {isShowRemoveRoom && (
        <RemoveRoomModal show={isShowRemoveRoom} setShow={setIsShowRemoveRoom}/>
      )}
    </div>
  );
}

export default MemberList;