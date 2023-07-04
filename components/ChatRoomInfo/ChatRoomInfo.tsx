import { Spin } from "antd";
import { useAppSelector } from "redux/hooks";
import styles from "./ChatRoomInfo.module.scss";
import { useMemo } from "react";
import { ERoomType } from "utils/contants";
import MemberList from "./MemberList/MemberList";

interface Props {
  className?: string;
  hidden?: boolean;
}

const ChatRoomInfo: React.FC<Props> = ({
  className,
  hidden,
}) => {

  const {
    user: { userInfo },
    room: { isLoadingDetail, activeChatRoomData },
  } = useAppSelector((state) => state);

  const roomName = useMemo(() => {
    if (activeChatRoomData?.type === ERoomType.Private) {
      const recipient = activeChatRoomData.users.find((user) => user.id !== userInfo.id);
      return recipient.name;
    }
    return activeChatRoomData?.name;
  }, [activeChatRoomData, userInfo]);

  return (
    <Spin spinning={isLoadingDetail}
      wrapperClassName={`${styles[`chat-room-info`]} ${
        hidden ? styles[`chat-room-info--hidden`] : ``
      } ${className}`}
    >
      <div className={`${styles[`chat-room-info__container`]}`}>
        <div className={styles["chat-room-info__title"]}>{roomName}</div>
        {activeChatRoomData?.type === ERoomType.Contribute && (
          <div className={styles["chat-room-info__member-list"]}>
            <MemberList memberList={activeChatRoomData.users} />
          </div>
        )}
      </div>
    </Spin>
  );
};

export default ChatRoomInfo;