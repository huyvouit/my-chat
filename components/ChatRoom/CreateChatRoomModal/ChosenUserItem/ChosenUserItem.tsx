import React from "react";
import styles from "./ChosenUserItem.module.scss";
import { IUserModel } from "services/types/user";
import { Avatar } from "antd";
import { AiFillCloseCircle, AiOutlineCloseCircle } from "react-icons/ai";


interface Props {
  roomUserData: IUserModel;
  handleRemoveChosenUser?: (user: IUserModel | null) => void;
}

const ChosenUserItem: React.FC<Props> = ({
  roomUserData,
  handleRemoveChosenUser,
}) => {

  return (
    <div className={`${styles[`chosen-user-item`]}`}>
      <div className={styles["chosen-user-item__container"]}>
        <div className={styles["chosen-user-item__avatar"]}>
          <Avatar size={40}>{roomUserData.name.substring(0, 2)}</Avatar>
        </div>
        <div className={styles["chosen-user-item__action"]}
          onClick={() => handleRemoveChosenUser && handleRemoveChosenUser(roomUserData)}
        >
          <AiFillCloseCircle size={16} className={styles["chosen-user-item__btn-remove"]} />
        </div>
      </div>
    </div>
  );
}

export default ChosenUserItem;