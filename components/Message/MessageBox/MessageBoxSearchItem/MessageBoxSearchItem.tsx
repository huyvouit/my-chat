import { Avatar } from "antd";
import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { RootState } from "redux/reducer";
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { IMessageModel } from "services/types/message";
import styles from "./MessageBoxSearchItem.module.scss";
import { unwrapResult } from "@reduxjs/toolkit";
import { doFindMessageInDatabase } from "redux/asyncThunk/messageAction";
import { common } from "utils/common";


interface Props {
  className?: string;
  id?: string;
  messageData: IMessageModel;
}

const MessageBoxSearchItem: React.FC<Props> = ({
  className,
  id,
  messageData
}) => {
  const dispatch = useAppDispatch();
  const {
    user: { userInfo },
    message: {
      messageByRoomList,
      messageSearchByKeywordList: {
        selectedMessage,
        loading
      },
      keywordSearchInRoom
    },
    room: {
      activeChatRoomData
    }
  } = useAppSelector((state: RootState) => state);

  const handleClick = async () => {
    dispatch(messageActions.setSelectedMessageSearch(messageData))
    let temp = messageByRoomList.data.find(message => message.id === messageData.id);
    if (!temp) {
      await dispatch(doFindMessageInDatabase({
        room: activeChatRoomData.id,
        messageId: messageData.id,
        pageIndex: messageByRoomList.pagination.pageIndex + 1,
        text: keywordSearchInRoom,
        response: {
          ...messageByRoomList.pagination,
          data: [],
        },
      }))
        .then(unwrapResult)
        .then(() => {
          setTimeout(() => {
            const zooming = [
              { transform: "rotate(0) scale(1.1)" },
            ];
            const timing = {
              duration: 1000,
              iterations: 1,
              delay: 200
            };

            const element = document.getElementById(`message-chat-${messageData.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.animate(zooming, timing);
            }
          }, 500);
        });
    } else {
      setTimeout(() => {
        const zooming = [
          { transform: "rotate(0) scale(1.1)" },
        ];
        const timing = {
          duration: 1000,
          iterations: 1,
          delay: 200
        };

        const element = document.getElementById(`message-chat-${temp?.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.animate(zooming, timing);
        }
      }, 500);
    }
  }

  return (
    <div
      id={id}
      className={`${styles[`message-box-search-item`]} ${selectedMessage.id === messageData.id ? styles[`message-box-search-item--active`] : ``}
        ${className}`
      }
      onClick={handleClick}
    >
      <div className={`${styles[`message-box-search-item__container`]}`}>
        <div className={`${styles[`message-box-search-item__avatar`]}`}>
          <Avatar size={50}>{messageData.createdBy?.name.substring(0, 2)}</Avatar>
        </div>
        <div className={`${styles[`message-box-search-item__info`]}`}>
          <div className={`${styles["message-box-search-item__title"]}`}>
            <LineThreeDots className={`${styles[`message-box-search-item__title-name`]}`}>
              {messageData.createdBy?.name}
            </LineThreeDots>
            <small className={`${styles[`message-box-search-item__title-time-ago`]}`}>
              {common.formatTimeToNowByLocale(messageData?.createdAt, undefined, true)}
            </small>
          </div>
          <div className={`${styles["message-box-search-item__content"]}`}>
            <LineThreeDots className={`${styles["message-box-search-item__last-message"]}`}>
              {messageData?.text}
            </LineThreeDots>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxSearchItem;