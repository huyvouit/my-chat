import { Badge, Dropdown, MenuProps, Spin } from "antd";
import React, { useEffect } from "react";
import { BiBell } from "react-icons/bi";
import { doGetAllNotification, doGetNotificationList, doGetNotificationListMore } from "redux/asyncThunk/notificationAction";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { IParamGetListNotification } from "services/types/notification";
import styles from "./Notification.module.scss";
import NotificationList from "./NotificationList/NotificationList";

const Notification = () => {
  const dispatch = useAppDispatch();

  const {
    notification: { notificationList, countNotify },
  } = useAppSelector((state) => state);

  const getNotification = (params: IParamGetListNotification) => {
    dispatch(doGetNotificationList({
      pageSize: 10,
      ...params,
      pageIndex: (params.pageIndex || 1) - 1
    }));
  }

  const getMoreNotification = () => {
    const { pageIndex, pageSize } = notificationList.pagination;
    dispatch(doGetNotificationListMore({
      pageSize: pageSize,
      pageIndex: pageIndex + 1,
    }));
  }

  const notificationListAction: MenuProps['items'] = [
    {
      key: "notification-list",
      label: (
        <Spin spinning={notificationList.loading}>
          <NotificationList
            getNotification={() => getNotification({})}
            getMoreNotification={getMoreNotification}
          />
        </Spin>
      ),
    },
  ];

  useEffect(() => {
    getNotification({});
    dispatch(doGetAllNotification({}));
  }, []);

  return (
    <div className="notification">
      <div className="notification__container">
        <Dropdown
          menu={{items: notificationListAction}} placement="bottomRight"
          autoFocus={false}
          trigger={["click"]}
          overlayClassName={styles["notification__dropdown-overlay"]}
        >
          <Badge count={countNotify} overflowCount={99}>
            <BiBell size={26} />
          </Badge>
        </Dropdown>
      </div>
    </div>
  );
};

export default Notification;