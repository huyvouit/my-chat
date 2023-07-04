import { roomActions } from './../../redux/slices/apiSlices/roomSlice';
import { Middleware } from "@reduxjs/toolkit";
import { doViewNewMessage } from "redux/asyncThunk/messageAction";
import { doFindRoomChatInDatabase } from 'redux/asyncThunk/roomAction';
import { messageActions } from "redux/slices/apiSlices/messageSlice";
import { notificationActions } from 'redux/slices/apiSlices/notificationSlice';
import { socketActions } from "redux/slices/appSlices/socketSlice";
import { apiRoom } from 'services/apiAction/apiRoom';
import { IMessageModel } from "services/types/message";
import { INotificationModel } from 'services/types/notification';
import { IRoomModel } from "services/types/room";
import { IUserModel } from "services/types/user";
import { io, Socket } from "socket.io-client";
import { common } from "utils/common";
import { ERoomType, ESocketEvent, MessageType } from "utils/contants";

const socketMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    try {
      const isConnected = socket && store.getState().socket.isConnected;

      if (!isConnected && socketActions.startConnecting.match(action)) {
        const socketUrl = process.env.SOCKET_URL || "";

        socket = io(socketUrl, {
          // withCredentials: false,
          // transports: ['websocket'],
          // path: '/websockets'
          query: {
            "token": common.getToken(),
          }
        });

        socket.on("connect", () => {
          store.dispatch(socketActions.connectionEstablished(socket.id));
        });

        socket.on("disconnect", () => {
          store.dispatch(socketActions.connectionFailed());
        });

        socket.on(ESocketEvent.ReceiveMessage, async (message: IMessageModel, room: IRoomModel, sender: IUserModel) => {
          const activeRoom: IRoomModel = socket && store.getState().room.activeChatRoomData;

          const user = socket && store.getState().user.userInfo;

          // set temp message info cho người tạo message
          if (message.type === MessageType.Info && user.id === sender.id) {
            store.dispatch(messageActions.setTempMessage(message as any));
          }

          //user đang ở trong room active
          if (user.id !== sender.id && activeRoom.id == room.id) {
            await store.dispatch(messageActions.setTempMessage(message as any));
            await store.dispatch(doViewNewMessage({ id: message.id }) as any)
          }

          if (room.users.some(someone => someone.id === user.id)) {
            const result = await apiRoom.getRoomDetail({ id: room.id });
            if (result.data.result) {
              store.dispatch(roomActions.setPushTempListRoom({
                ...result.data.data,
                message
              }))
            }
          }
        });

        socket.on(ESocketEvent.CreatedRoom, async (room: IRoomModel) => {
          if (room.type === ERoomType.Contribute) {
            store.dispatch(roomActions.setPushNewRoomToList(room));
            return;
          }

          const chatRoomList = socket && store.getState().room?.chatRoomList;
          const temp = chatRoomList.data.find(a => a.id === room.id);
          if (temp) return;

          const result = await store.dispatch(doFindRoomChatInDatabase({
            roomId: chatRoomList?.data.id,
            pageIndex: chatRoomList?.pagination.pageIndex + 1,
            response: {
              ...chatRoomList?.pagination,
              data: [],
            },
          }) as any);

          const existedRoom = result.payload.data?.find(a => a.id === room.id);
          if (!existedRoom) {
            store.dispatch(roomActions.setPushNewRoomToList(room));
          }
        });

        socket.on(ESocketEvent.UpdatedMessage, async (message: IMessageModel, room: IRoomModel, sender: IUserModel) => {
          const activeRoom: IRoomModel = socket && store.getState().room.activeChatRoomData;
          const user = socket && store.getState().user.userInfo;
          if (user.id !== sender.id && activeRoom.id == room.id) {
            store.dispatch(messageActions.setUpdateTempMessage(message as any));
          }
        });

        socket.on(ESocketEvent.RemoveMessageForAll, async (message: IMessageModel, room: IRoomModel, sender: IUserModel) => {
          const activeRoom: IRoomModel = socket && store.getState().room.activeChatRoomData;

          const user = socket && store.getState().user.userInfo;
          if (user.id !== sender.id) {
            store.dispatch(messageActions.setDeteleTempMessageForAll(message as any));
            console.log(room)
          }
          store.dispatch(roomActions.setUpdateTempListRoom(room));
        });

        socket.on(ESocketEvent.ReceiveNotification, (notification: INotificationModel) => {
          store.dispatch(notificationActions.updateNotification(1));
          store.dispatch(notificationActions.setPushNewNotification(notification));
        });
      }

      next(action);
    }
    catch (e) {
      console.log(e);
      next(action);
    }
  };
};

export default socketMiddleware;
