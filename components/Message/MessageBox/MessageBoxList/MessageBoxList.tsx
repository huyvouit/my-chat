import { List, Spin } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageBoxItem from "./MessageBoxItem/MessageBoxItem";
import styles from "./MessageBoxList.module.scss";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { doGetMessagePaginationList, doGetMessagePaginationListMore } from "redux/asyncThunk/messageAction";
import { IMessageModel, IParamsMessageList, IResMessage, IResMessageList } from "services/types/message";
import { HiOutlineArrowSmDown } from "react-icons/hi";
import MyButton from "components/common/MyButton/MyButton";
import { MessageType } from "utils/contants";
import moment from "moment";
import { common } from "utils/common";

interface Props {
  // roomId: string | string[];
}

const MessageBoxList: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const isLoadingMore = useRef<boolean>(true);
  const listRef = useRef<any>();

  const {
    message: { messageByRoomList: { data, pagination } },
    room: { activeChatRoomData }
  } = useAppSelector((state) => state);

  const [pageLoadMore, setPageLoadMore] = useState<number>(1);

  const getMessagePaginationList = (roomId?: string | string[]) => {
    const param: IParamsMessageList = {
      room: roomId,
      pageIndex: 1,
    };

    dispatch(doGetMessagePaginationList(param));
  };

  const loadMoreData = () => {
    if (isLoadingMore && isLoadingMore.current) {
      return;
    }
    if (data.length > 0) {
      const nextPage = pageLoadMore + 1;
      isLoadingMore.current = true;

      dispatch(doGetMessagePaginationListMore({
        room: activeChatRoomData.id,
        pageIndex: nextPage,
      }))
        .then(unwrapResult)
        .then((res: IResMessage<IResMessageList>) => {
          setPageLoadMore(nextPage);
        })
        .finally(() => {
          isLoadingMore.current = false;
        });
    }
  };

  const scrollToLatestMessList = () => {
    setTimeout(() => {
      const messageList = document.getElementById("message-list");
      if (messageList) {
        messageList.scroll({ top: messageList.scrollHeight, behavior: "smooth" });
      }
    }, 400);
  };

  const handleButtonScroll = () => {
    const buttonScroll = document.getElementById("message-button-scroll");
    if (listRef.current.scrollTop < -500) {
      buttonScroll.style.display = "block";
    } else {
      buttonScroll.style.display = "none";
    }
  };

  const renderMessageBoxItem = (message?: IMessageModel, index?: number, isShow?: boolean, isShowTime?: boolean) => {
    const show = common.minusDay(message.createdAt.toString(), data[index + 1]?.createdAt.toString());
    return (
      <React.Fragment key={message.id}>
        <MessageBoxItem messageData={message} isShow={show ? show : isShow} isShowTime={isShowTime} />
        {show && (
          <div className={`${styles["message-box-list__date-split"]}`}>
            <span>{moment(message.createdAt).format("DD-MM-YYYY")}</span>
          </div>
        )}
      </React.Fragment>
    )
  };

  useEffect(() => {
    if (pagination.pageIndex < pageLoadMore) {
      setPageLoadMore(1);
    }
  }, [activeChatRoomData]);

  useEffect(() => {
    if (activeChatRoomData && activeChatRoomData?.id) {
      getMessagePaginationList(activeChatRoomData?.id);
    }
    isLoadingMore.current = false;
    scrollToLatestMessList();
  }, [activeChatRoomData?.id]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.addEventListener('scroll', handleButtonScroll);
    }
  }, []);

  return (
    <div className={`${styles["message-box-list"]}`}>
      <div className={`${styles["message-box-list__container"]}`} id={"message-list"} ref={listRef}>
        <InfiniteScroll
          // className={`${styles["message-box-list__scroll"]}`}
          dataLength={data.length}
          next={loadMoreData}
          loader={
            <></>
          }
          inverse={true}
          hasMore={pagination.hasNextPage || false}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          scrollableTarget={"message-list"}
        >
          <List dataSource={data || []}
            className={`${styles["message-box-list__view"]}`}
            renderItem={(message, index) => {
              if (message.createdBy.id === data[index + 1]?.createdBy?.id && data[index + 1]?.type !== MessageType.Info) {
                if (message.createdBy.id === data[index - 1]?.createdBy?.id && data[index - 1]?.type !== MessageType.Info) {
                  return (
                    renderMessageBoxItem(message, index, false, false)
                  )
                } else {
                  return (
                    renderMessageBoxItem(message, index, false, true)
                  )
                }
              } else {
                if (message.createdBy.id === data[index - 1]?.createdBy?.id && data[index - 1]?.type !== MessageType.Info) {
                  return (
                    renderMessageBoxItem(message, index, true, false)
                  )
                } else {
                  return (
                    renderMessageBoxItem(message, index, true, true)
                  )
                }
              }
            }
            }
          />
        </InfiniteScroll>
      </div>
      <div className={`${styles["message-box-list__button"]}`} id={"message-button-scroll"}>
        <MyButton
          onClick={scrollToLatestMessList}
          className={`${styles[`message-box-list__button-scroll`]}`}
          type="primary"
          icon={<HiOutlineArrowSmDown size={22} color="green" />}
          style={{ backgroundColor: "transparent" }}
        ></MyButton>
      </div>
    </div>
  );
};

export default MessageBoxList;
