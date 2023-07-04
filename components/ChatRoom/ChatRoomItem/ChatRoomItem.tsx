import { Avatar, Badge } from "antd";
import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import moment from "moment";
import { Fragment, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { RootState } from "redux/reducer";
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { IMessageModel } from "services/types/message";
import { IRoomModel } from "services/types/room";
import { ERoomRole, ERoomType, MessageType } from "utils/contants";
import styles from "./ChatRoomItem.module.scss";
import { common } from "utils/common";


interface Props {
  className?: string;
  id?: string;
  isActiveRoom?: string;
  setActiveRoom?: (id: string) => void;
  dataUser: IRoomModel;
}

const ChatRoomItem: React.FC<Props> = ({
  className,
  id,
  isActiveRoom,
  setActiveRoom,
  dataUser,
}) => {
  const dispatch = useAppDispatch();
  const {
    user: { userInfo },
  } = useAppSelector((state: RootState) => state);

  const roomName = useMemo(() => {
    if (dataUser.type === ERoomType.Private) {
      const recipient = dataUser.users.find((user) => user.id !== userInfo.id);
      return recipient.name;
    }
    return dataUser.name;
  }, [dataUser, userInfo]);

  const messageUnread = useMemo(() => {
    return dataUser.messagesUnRead
  }, [dataUser]);

  const creator = useMemo(() => {
    const creator = dataUser.users.find(user => user.id === dataUser.messages[dataUser.messages.length - 1]?.createdBy.id);
    return creator;
  }, [dataUser]);

  const renderLastMessage = (dataUser: IRoomModel) => {
    if(dataUser.messages.length > 0) {
      const lastMessage = dataUser.messages[dataUser.messages.length - 1];
      const name = creator?.id === userInfo.id ? "You" : creator?.name;

      if(lastMessage.type === MessageType.Text) {
        return dataUser.messages[dataUser.messages.length - 1]?.text;
      } else if (lastMessage.type === MessageType.Info) {
        return dataUser.messages[dataUser.messages.length - 1]?.text.replace("{{creatorName}}", name).replace(userInfo.name, "You");
      } else if (lastMessage.type === MessageType.Image) {
        return `${name} sent a photo.`.replace(userInfo.name, "You");
      } else {
        return `${name} sent a file.`.replace(userInfo.name, "You");
      }
    }

    return "No message";
  };

  return (
    <div
      id={id}
      className={`${styles[`chat-room-item`]} ${isActiveRoom === dataUser.id ? styles[`chat-room-item--active`] : ``}
        ${className}`
      }
      onClick={() => { setActiveRoom(dataUser.id); dispatch(messageActions.setRepliedMessage({} as IMessageModel)); }}
    >
      <div className={`${styles[`chat-room-item__container`]}`}>
        <div className={`${styles[`chat-room-item__avatar`]}`}>
          <Avatar size={50}>{roomName.substring(0, 2)}</Avatar>
        </div>
        <div className={`${styles[`chat-room-item__info`]}`}>
          <div className={`${styles["chat-room-item__title"]}`}>
            <LineThreeDots className={`${styles[`chat-room-item__title-name`]}`}>
              {roomName}
            </LineThreeDots>
            <small className={`${styles[`chat-room-item__title-time-ago`]}`}>
              {common.formatTimeToNowByLocale(dataUser.messages[dataUser.messages.length - 1]?.createdAt, undefined, true)}
            </small>
          </div>
          <div className={`${styles["chat-room-item__content"]}`}>
            <LineThreeDots className={`${styles["chat-room-item__last-message"]} ${messageUnread > 0 ? styles["chat-room-item__last-message--unread"] : ``}`}>
              {renderLastMessage(dataUser)}
            </LineThreeDots>
            {<div className={`${styles[`chat-room-item__message-unread-count`]}`}>
              <Badge
                count={messageUnread || 0}
                overflowCount={5}
                size="small"
                className={`${styles[`chat-room-item__unread-count`]}`}
              />
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomItem;