import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { doViewAllMessageInRoom } from "redux/asyncThunk/messageAction";
import { doFindRoomChatInDatabase, doGetRoomDetail, doGetRoomList, doGetRoomListMore } from "redux/asyncThunk/roomAction";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { IParamGetRoomList, IResRoomDetail, IResRoomList } from "services/types/room";
import styles from './ChatRoom.module.scss';
import ChatRoomList from "./ChatRoomList/ChatRoomList";
import useResizeScreen from "hooks/useResizeScreen";
import { roomActions } from "redux/slices/apiSlices/roomSlice";

interface Props {
  className?: string;
  roomId?: string;
  hidden?: boolean;
}

const ChatRoom: React.FC<Props> = ({
  className,
  roomId,
  hidden,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentPage = useRef<number>(1);
  const { isMobile } = useResizeScreen();

  const {
    room: { chatRoomList: { data, loading } },
  } = useAppSelector((state) => state);

  const [loadingFindIndex, setLoadingFindIndex] = useState<boolean>(false);

  const getChatRooms = (params: IParamGetRoomList, firstLoading: boolean) => {
    dispatch(doGetRoomList({
      pageSize: 10,
      ...params,
      pageIndex: (params.pageIndex || 1) - 1
    })).then(unwrapResult)
      .then((res) => {
        if (!isMobile && !roomId && res.data.data?.[0]?.id) {
          router.push({
            query: { roomId: res.data.data?.[0]?.id }
          }, undefined, { shallow: true });
        }
        if (firstLoading && !!roomId) {
          getIndexRoom(res.data);
        }
      });
  }

  const getIndexRoom = async (res: IResRoomList) => {
    const { data, ...paginationResponse } = res;
    const temp = data.find(a => a.id === roomId);
    if (temp && temp.id) {
      scrollToRoom(temp.id);
    } else {
      setLoadingFindIndex(true);

      const result = await dispatch(doFindRoomChatInDatabase({
        roomId: roomId,
        pageIndex: paginationResponse.pageIndex + 1,
        response: {
          ...paginationResponse,
          data: [],
        },
      })).then(unwrapResult);
      currentPage.current = result.pageIndex;

      const existedInRedux = result.data.find(a => a.id === roomId);
      if (existedInRedux) {
        scrollToRoom(roomId);
      } else {
        router.push({
          query: { roomId: data[0]?.id }
        }, undefined, { shallow: true });
      }
      setLoadingFindIndex(false);
    }
  }

  const scrollToRoom = useCallback((roomId: string) => {
    setTimeout(() => {
      const element = document.getElementById(`room-chat-${roomId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: "center" });
      }
    }, 500);
  }, [roomId]);

  // const scrollChatMessages = () => {
  //   var element = document.getElementById(KeyElement.MessList);
  //   if (element) {
  //     element.scrollTo({ left: 0, top: element.scrollHeight, behavior: "smooth" });
  //   }
  // }

  const getMoreChatRooms = () => {
    const nextPage = currentPage.current + 1;
    dispatch(doGetRoomListMore({ pageIndex: nextPage, pageSize: 10 }));
    currentPage.current = nextPage;
  }

  const getDetailChatRoom = useCallback(async () => {
    if (!roomId) {
      dispatch(roomActions.setActiveChatRoomData(null));
      return;
    }
    await dispatch(doGetRoomDetail({ id: roomId as string }))
      .then(unwrapResult)
      .then((res: IResRoomDetail) => {
        if (!res.data) {
          router.push('/404');
          return;
        }
        dispatch(doViewAllMessageInRoom({ room: res.data?.id }));
      })
      .catch(() => {
        router.push('/404');
      });

  }, [roomId]);

  useEffect(() => {
    getDetailChatRoom();
    scrollToRoom(roomId);
  }, [roomId]);

  useEffect(() => {
    getChatRooms({}, true);
  }, []);

  return (
    <div className={`${styles[`chat-room`]} ${
        hidden ? styles[`chat-room--hidden`] : ``
      } ${className}`}
    >
      <Spin spinning={loading || loadingFindIndex}>
        <div className={`${styles[`chat-room__container`]}`}>
          <ChatRoomList
            scrollToRoom={scrollToRoom}
            getChatRooms={() => getChatRooms({}, false)}
            getMoreChatRooms={getMoreChatRooms}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ChatRoom;