import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import React from "react";
import { IoIosClose } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { IMessageModel } from "services/types/message";
import { MessageType } from "utils/contants";
import styles from './MessageBoxReplied.module.scss';

interface Props {
  className?: string;
}

const MessageBoxReplied = React.forwardRef<any, Props>(({
  className,
  ...props
}, ref) => {
  const dispatch = useAppDispatch();
  const {
    message: {
      repliedMessageSelected
    },
    user: {
      userInfo
    }
  } = useAppSelector((state) => state);

  const handleClearReplied = () => {
    dispatch(messageActions.setRepliedMessage({} as IMessageModel));
  }
  return (
    <div className={`${styles[`message-box-replied`]}`}>
      <div className={`${styles[`message-box-replied__container`]}`}>
        <div
          className={`${styles["message-box-replied--closed"]}`}
          onClick={handleClearReplied}
        >
          <IoIosClose size={30} />
        </div>
        <div className={`${styles["message-box-replied__title"]}`}>
          <LineThreeDots className={`${styles[`message-box-replied__title-name`]}`}>
            Replying to <strong>{repliedMessageSelected.createdBy.name == userInfo.name ? "You" : repliedMessageSelected.createdBy.name}</strong>
          </LineThreeDots>
        </div>
        <div className={`${styles["message-box-replied__content"]}`}>
          {
            repliedMessageSelected.type === MessageType.Text ?
              <LineThreeDots className={`${styles["message-box-replied__message"]}`}>
                {repliedMessageSelected.text}
              </LineThreeDots>
              : repliedMessageSelected.type === MessageType.Image ? "Image" : "Attachment"
          }
        </div>
      </div>
    </div>
  );
});

export default MessageBoxReplied;