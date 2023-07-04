import { Avatar, Badge, Dropdown } from "antd";
import { INotificationModel } from "services/types/notification";
import { ERoomType, NotificationStatus, NotificationType } from "utils/contants";
import styles from "./NotificationItem.module.scss";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import { useRouter } from "next/router";
import { doDeleteNotification, doUpdateStatusNotification } from "redux/asyncThunk/notificationAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { SlOptions } from "react-icons/sl";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { AiOutlineCheck, AiOutlineCloseSquare, AiOutlineMessage } from "react-icons/ai";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import { notificationActions } from "redux/slices/apiSlices/notificationSlice";
import moment from "moment";
import { common } from "utils/common";
import message from "pages/message";

type MyItemMenu = ItemType & {
  isShowItem: boolean | string,
};

interface Props {
  className?: string;
  notiData: INotificationModel;
}

const NotificationItem: React.FC<Props> = ({
  className,
  notiData,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user: { userInfo },
  } = useAppSelector((state) => state);

  const handleClickNotification = () => {
    dispatch(doUpdateStatusNotification({ id: notiData.id, status: NotificationStatus.Read }))
      .then(unwrapResult)
      .then(() => {
        router.push({ query: { roomId: notiData?.room.id } }, undefined, { shallow: true });
        if (notiData.status === NotificationStatus.UnRead) {
          dispatch(notificationActions.updateNotification(-1));
        }
        setTimeout(() => {
          const element = document.getElementById(`message-chat-${notiData?.message?.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      })
  };

  const handleUpdateStatusNotification = (status: NotificationStatus) => {
    dispatch(doUpdateStatusNotification({ id: notiData.id, status }))
      .then(unwrapResult)
      .then((res) => {
        if (res.data.status === NotificationStatus.Read) {
          dispatch(notificationActions.updateNotification(-1));
        } else {
          dispatch(notificationActions.updateNotification(1));
        }
      })
  };

  const handleDeleteNotification = () => {
    dispatch(doDeleteNotification({ id: notiData.id }));
    if (notiData.status === NotificationStatus.UnRead) {
      dispatch(notificationActions.updateNotification(-1));
    }
  };

  const notificationActionItems: MyItemMenu[] = useMemo(
    () => [
      {
        label: (
          <div onClick={() => handleUpdateStatusNotification(NotificationStatus.Read)}>
            Mark as read
          </div>
        ),
        key: "Mark as read",
        icon: <AiOutlineCheck size={20} />,
        isShowItem: notiData.status === NotificationStatus.UnRead,
      },
      {
        label: (
          <div onClick={() => handleUpdateStatusNotification(NotificationStatus.UnRead)}>
            Mark as unread
          </div>
        ),
        key: "Mark as unread",
        icon: <AiOutlineCheck size={20} />,
        isShowItem: notiData.status === NotificationStatus.Read,
      },
      {
        label: (
          <div onClick={handleDeleteNotification}>
            Remove this notification
          </div>
        ),
        key: "Remove this notification",
        icon: <AiOutlineCloseSquare size={20} />,
        isShowItem: true,
      },
    ],
    [userInfo, notiData]
  );

  const roomName = useMemo(() => {
    if (notiData.room.type === ERoomType.Private) {
      const recipient = notiData.room.users.find((user) => user.id !== userInfo.id);
      return recipient.name;
    }
    return notiData.room.name;
  }, [notiData]);

  const receiverName = useMemo(() => {
    if (
      notiData.room.type === ERoomType.Private ||
      notiData.type === NotificationType.CreateRoom
    ) {
      return "you";
    }
    return `<b>${roomName}</b>`;
  }, [notiData]);

  return (
    <div className={`${styles[`notification-item`]} ${className}`} onClick={handleClickNotification}>
      <div className={styles["notification-item__container"]}>
        <div className={styles["notification-item__avatar"]}>
          <Avatar size={50}>{roomName?.substring(0, 2)}</Avatar>
        </div>
        <div className={styles["notification-item__info"]}>
          {/* <div
            className={styles["notification-item__title"]}
            dangerouslySetInnerHTML={{
              __html: notiData.title.replace("{{roomName}}", `<b>${roomName}</b>`),
            }}
          >
          </div> */}
          <LineThreeDots numberLine={3} className={styles["notification-item__description"]}>
            <div
              dangerouslySetInnerHTML={{
                __html: notiData.content
                  .replace(userInfo.name, `you`)
                  .replace("{{senderName}}", `<b>${notiData.createdBy.name}</b>`)
                  .replace("{{receiverName}}", `${receiverName}`)
                  .replace("{{roomName}}", `<b>${roomName}</b>`)
                  .replace("{{messageText}}", `${notiData.message?.text}`)
              }}
            >
            </div>
          </LineThreeDots>
          <div className={`${styles[`notification-item__ago`]} ${notiData.status === NotificationStatus.UnRead ? styles[`notification-item__ago--unread`] : ``}`}>
            {common.formatTimeToNowByLocale(notiData.createdAt, undefined)}
          </div>
        </div>
        <div className={styles["notification-item__status"]}>
          {notiData.status === NotificationStatus.UnRead && (
            <Badge color="green" />
          )}
        </div>

        <div className={styles["notification-item__actions"]} onClick={(e) => e.stopPropagation()}>
          <Dropdown
            menu={{ items: notificationActionItems.filter((item) => item.isShowItem) }} placement="bottomRight"
            autoFocus={false}
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
            overlayClassName={styles["notification-item__dropdown"]}
          >
            <SlOptions size={14} />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;