import { List, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { AiFillMessage } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { roomActions } from "redux/slices/apiSlices/roomSlice";
import { KeyElement } from "utils/contants";
import ChatRoomItem from "../ChatRoomItem/ChatRoomItem";
import styles from "./ChatRoomList.module.scss";

interface Props {
  scrollToRoom?: (roomId: string) => void;
  getChatRooms: () => void;
  getMoreChatRooms: () => void;
}

const ChatRoomList: React.FC<Props> = ({
  getChatRooms,
  getMoreChatRooms,
}) => {
  const router = useRouter();

  const { roomId } = router.query;

  const {
    room: {
      chatRoomList: { data, pagination },
    },
  } = useAppSelector((state) => state);

  const chooseChatRoom = (roomId: string) => {
    router.push({ query: { roomId: roomId } }, undefined, { shallow: true });
  }

  return (
    <div className={styles["chat-room-list"]} id={KeyElement.ChatRoomList}>
      <div className={styles["chat-room-list__title"]}>
        <AiFillMessage size={20} />
        <span>ALL MESSAGE</span>
      </div>
      <InfiniteScroll className={styles["chat-room-list__scroll"]}
        dataLength={data.length}
        next={getMoreChatRooms}
        scrollThreshold={0.9}
        pullDownToRefresh={true}
        refreshFunction={getChatRooms}
        hasMore={pagination.hasNextPage || false}
        scrollableTarget={KeyElement.ChatRoomList}
        loader={
          <Skeleton className={`${styles["chat-room-list__skeleton"]}`}
            active
            avatar={{ size: 34 }}
            paragraph={{ rows: 1, style: { height: "20px", margin: "0px" } }}
          ></Skeleton>
        }
      >
        <List
          split={false}
          dataSource={data}
          renderItem={(item: any) => (
            <ChatRoomItem id={`room-chat-${item.id}`}
              className={`${Number(roomId) === item.id ? styles["chat-room-list__item--focus"] : ``
                }`}
              dataUser={item}
              isActiveRoom={roomId?.toString()}
              setActiveRoom={chooseChatRoom}
            ></ChatRoomItem>
          )}
        />
      </InfiniteScroll>
    </div>
  );
}

export default ChatRoomList;