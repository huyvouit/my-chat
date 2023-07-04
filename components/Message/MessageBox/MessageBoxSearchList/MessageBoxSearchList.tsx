import React, { useRef, useState } from "react";
import { List, Skeleton } from "antd";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { KeyElement } from "utils/contants";
import styles from "./MessageBoxSearchList.module.scss";
import MessageBoxSearchItem from "../MessageBoxSearchItem/MessageBoxSearchItem";
import useResizeScreen from "hooks/useResizeScreen";
import { doGetMessagePaginationListByKeywordMore } from "redux/asyncThunk/messageAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { IResMessage, IResMessageList } from "services/types/message";

interface Props {
}

const MessageBoxListSearch: React.FC<Props> = ({

}) => {
  const router = useRouter();
  const { isMobile } = useResizeScreen();
  const { roomId } = router.query;
  const dispatch = useAppDispatch();
  
  const {
    message: {
      messageSearchByKeywordList: { data, pagination },
      keywordSearchInRoom
    },
    room: { activeChatRoomData }
  } = useAppSelector((state) => state);

  const isLoadingMore = useRef<boolean>(false);
  const [pageLoadMore, setPageLoadMore] = useState<number>(1);

  const loadMoreData = () => {
    if (isLoadingMore && isLoadingMore.current) {
      return;
    }
    if (data.length > 0) {
      const nextPage = pageLoadMore + 1;
      isLoadingMore.current = true;

      dispatch(doGetMessagePaginationListByKeywordMore({
        room: activeChatRoomData.id,
        text: keywordSearchInRoom || undefined,
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

  return (
    <div className={styles["message-box-search-list"]} id={KeyElement.MesageSearchList}>
      {!isMobile ? (
        <div className={styles["message-box-search-list__title"]}>
          Search Results
          <span>Input keywwords to search in this conversation</span>
        </div>
      ) : (
        <div className={styles["message-box-search-list__title"]}>
          Search Results
        </div>
      )}
      <InfiniteScroll className={styles["message-box-search-list__scroll"]}
        dataLength={data.length}
        next={() => { }}
        scrollThreshold={0.9}
        hasMore={pagination.hasNextPage || false}
        scrollableTarget={KeyElement.MesageSearchList}
        loader={
          <Skeleton className={`${styles["message-box-search-list__skeleton"]}`}
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
            <MessageBoxSearchItem id={`${KeyElement.MesageSearchList}-${item.id}`}
              className={`${Number(roomId) === item.id ? styles["message-box-search-list__item--focus"] : ``
                }`}
              messageData={item}
            ></MessageBoxSearchItem>
          )}
        />
      </InfiniteScroll>
    </div>
  );
}

export default MessageBoxListSearch;