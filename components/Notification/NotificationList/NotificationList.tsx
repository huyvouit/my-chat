import { List, Skeleton, Switch } from "antd";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { KeyElement, NotificationStatus, NotificationType } from "utils/contants";
import NotificationItem from "../NotificationItem/NotificationItem";
import styles from "./NotificationList.module.scss";
import { doGetAllNotification, doUpdateReadAllNotification } from "redux/asyncThunk/notificationAction";
import { useEffect, useState } from "react";
import { INotificationModel } from "services/types/notification";
import { unwrapResult } from "@reduxjs/toolkit";

interface Props {
  scrollToRoom?: (roomId: string) => void;
  getNotification: () => void;
  getMoreNotification: () => void;
}

const NotificationList: React.FC<Props> = ({
  getNotification,
  getMoreNotification,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    notification: {
      notificationList: { data, pagination },
      countNotify,
    },
  } = useAppSelector((state) => state);

  const [isFilterUnRead, setIsFilterUnRead] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<INotificationModel[]>([]);

  const handleReadAllNotification = (e: any) => {
    e.stopPropagation();
    dispatch(doUpdateReadAllNotification());
  };

  const handleChangeRenderList = (checked: boolean, event: any) => {
    event.stopPropagation();
    if (checked) {
      setIsFilterUnRead(true);
    } else {
      setIsFilterUnRead(false);
    }
  };

  useEffect(() => {
    if (isFilterUnRead) {
      dispatch(doGetAllNotification({ status: NotificationStatus.UnRead }))
        .then(unwrapResult)
        .then((res) => {
          setFilterData(res.data);
        });
    }
  }, [isFilterUnRead, data]);

  return (
    <div className={styles["notification-list"]} id={KeyElement.NotificationList}>
      <div className={styles["notification-list__header"]}>
        <div className={styles["notification-list__title"]}>
          <span>Notifications</span>
        </div>
        <div className={styles["notification-list__action"]}>
          <span>Only show unread</span>
          <Switch onChange={handleChangeRenderList} />
        </div>
      </div>
      {countNotify > 0 && (
          <div className={styles["notification-list__read-all-btn"]} onClick={handleReadAllNotification}>
            Mark all as read
          </div>
        )}
      <InfiniteScroll className={styles["notification-list__scroll"]}
        dataLength={data.length}
        next={getMoreNotification}
        scrollThreshold={0.9}
        pullDownToRefresh={true}
        refreshFunction={getNotification}
        hasMore={isFilterUnRead ? false : data.length < pagination.totalCount}
        scrollableTarget={KeyElement.NotificationList}
        loader={
          <Skeleton className={`${styles["notification-list__skeleton"]}`}
            active
            avatar={{ size: 34 }}
            paragraph={{ rows: 1, style: { height: "20px", margin: "0px" } }}
          ></Skeleton>
        }
      >
        <List
          split={false}
          dataSource={isFilterUnRead ? filterData : data}
          renderItem={(notification) => (
            <NotificationItem notiData={notification} />
          )}
        />
      </InfiniteScroll>
    </div>
  );
}

export default NotificationList;