
import { IUserModel } from "services/types/user";
import RoomUserItem from "../RoomMemberItem/RoomUserItem";
import styles from "./RoomUserList.module.scss";

interface Props {
  roomUserList: IUserModel[];
  chosenUsers?: IUserModel[] | null;
  onAddChosenUser: (user: IUserModel | null) => void;
  onRemoveChosenUser: (user: IUserModel | null) => void;
  hasDirectMessage?: boolean;
}

const RoomUserList: React.FC<Props> = ({
  roomUserList,
  chosenUsers,
  onAddChosenUser,
  onRemoveChosenUser,
  hasDirectMessage
}) => {
  return (
    <div className={styles["room-user-list"]}>
      <div className={styles["room-user-list__container"]}>
        <div className={styles["room-user-list__title"]}>Member</div>
        <div className={styles["room-user-list__list"]}>
          {roomUserList.map((roomUserItem) => (
            <RoomUserItem
              key={roomUserItem.id}
              roomUserData={roomUserItem}
              chosenUsers={chosenUsers}
              onAddChosenUser={onAddChosenUser}
              onRemoveChosenUser={onRemoveChosenUser}
              hasDirectMessage={hasDirectMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoomUserList;