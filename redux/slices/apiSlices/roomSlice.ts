import { IResDeleteRoom, IResRoom, IResRoomList, IRoomLastMessageModel } from 'services/types/room';
import { doGetRoomList, doGetRoomDetail, doGetRoomListMore, doFindRoomChatInDatabase, doCreateRoom, doRemoveRoomMember, doAddRoomMember, doDeleteRoom } from './../../asyncThunk/roomAction';
import { IRoomModel, IResRoomDetail } from './../../../services/types/room';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EResponseResult, ERoomRole, MessageType } from '../../../utils/contants';
import { IPaginationModel } from 'services/types/common';
import { doViewAllMessageInRoom } from 'redux/asyncThunk/messageAction';
import { IParamsMessageList, IResMessage } from 'services/types/message';

interface IInitialState {
  isLoading: boolean,
  isLoadingDetail: boolean,
  chatRoomList: {
    data: IRoomModel[],
    pagination: IPaginationModel,
    loading: boolean,
  },
  activeChatRoomData: IRoomModel,
  isShowCreateRoomModal: boolean,
  isShowChatRoomInfo: boolean,
  loadingCreateRoom: boolean,
}

const initialState = {
  isLoading: false,
  isLoadingDetail: false,
  chatRoomList: {
    data: [],
    pagination: {},
    loading: false,
  },
  activeChatRoomData: {} as IRoomModel,
  isShowCreateRoomModal: false,
  isShowChatRoomInfo: false,
  loadingCreateRoom: false,
} as IInitialState;

const roomSlice = createSlice({
  name: 'room',
  initialState: initialState,
  reducers: {
    setActiveChatRoomData: (state, actions: PayloadAction<IRoomModel>) => {
      state.activeChatRoomData = actions.payload;
    },

    setPushTempListRoom: (state, actions: PayloadAction<IRoomLastMessageModel>) => {
      const { message, ...room } = actions.payload;

      let roomTemp: IRoomModel = { ...room };
      // const existedRoom = state.chatRoomList.data.find((room => room.id == roomTemp.id));
      // if (existedRoom) {
      //   roomTemp = existedRoom;
      // }

      roomTemp.messages.push(message);
      state.chatRoomList.data = state.chatRoomList.data.filter((room => room.id != roomTemp.id));
      state.chatRoomList.data.unshift(roomTemp);

    },

    setShowCreateRoomModal: (state, actions: PayloadAction<boolean>) => {
      state.isShowCreateRoomModal = actions.payload;
    },
    setPushNewRoomToList: (state, actions: PayloadAction<IRoomModel>) => {
      state.chatRoomList.data = [actions.payload, ...state.chatRoomList.data];
    },

    setNewMessagesUnRead: (state, actions: PayloadAction<IRoomModel>) => {
      const currentRoomIndex = state.chatRoomList.data.findIndex(item => item.id == actions.payload.id);
      if (currentRoomIndex >= 0) {
        if (typeof state.chatRoomList.data[currentRoomIndex].messagesUnRead != "undefined") {
          state.chatRoomList.data[currentRoomIndex].messagesUnRead++;
        }
        else {
          state.chatRoomList.data[currentRoomIndex].messagesUnRead = 1;
        }
      }
    },
    setUpdateTempListRoom: (state, actions: PayloadAction<IRoomModel>) => {
      const payload = actions.payload;
      if (payload) {
        state.chatRoomList.data = state.chatRoomList.data.map(item => {
          if (item.id === payload.id) {
            return { ...payload };
          }
          return item;
        });
      }
    },
    setRemoveRoom: (state, actions: PayloadAction<IRoomModel>) => {
      state.chatRoomList.data = state.chatRoomList.data.filter(item => item.id != actions.payload.id);
    },
    setShowChatRoomInfo: (state, actions: PayloadAction<boolean>) => {
      state.isShowChatRoomInfo = actions.payload;
    },
  },
  extraReducers: (builder) => {
    //doGetRoomList
    builder
      .addCase(doGetRoomList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(doGetRoomList.fulfilled, (state, action: PayloadAction<IResRoom<IResRoomList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          state.chatRoomList.data = data;
          state.chatRoomList.pagination = { ...pagination };
          state.chatRoomList.loading = false;
        }
      })
      .addCase(doGetRoomList.rejected, (state) => {
        state.isLoading = false;
      });

    //doGetRoomListMore
    builder
      .addCase(doGetRoomListMore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(doGetRoomListMore.fulfilled, (state, action: PayloadAction<IResRoom<IResRoomList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          const roomListMore = data.filter((item) => !state.chatRoomList.data.find((room) => room.id === item.id));
          state.chatRoomList.data = [...state.chatRoomList.data, ...roomListMore];
          state.chatRoomList.pagination = { ...pagination };
          state.chatRoomList.loading = false;
        }
      })
      .addCase(doGetRoomListMore.rejected, (state) => {
        state.isLoading = false;
      });

    //doGetRoomDetail
    builder
      .addCase(doGetRoomDetail.pending, (state) => {
        state.isLoadingDetail = true;
      })
      .addCase(doGetRoomDetail.fulfilled, (state, action: PayloadAction<IResRoomDetail>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.activeChatRoomData = payload.data;
        }
        state.isLoadingDetail = false;
      })
      .addCase(doGetRoomDetail.rejected, (state) => {
        state.isLoadingDetail = false;
      });

    //doFindRoomChatInDatabase
    builder
      .addCase(doFindRoomChatInDatabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(doFindRoomChatInDatabase.fulfilled, (state, action: PayloadAction<IResRoomList>) => {
        const { data, ...pagination } = action.payload;
        state.chatRoomList.data = [...state.chatRoomList.data, ...data];
        state.chatRoomList.pagination = { ...pagination };
        state.chatRoomList.loading = false;
      })
      .addCase(doFindRoomChatInDatabase.rejected, (state) => {
        state.isLoading = false;
      });

    //doCreateRoom
    builder
      .addCase(doCreateRoom.pending, (state) => {
        state.loadingCreateRoom = true;
      })
      .addCase(doCreateRoom.fulfilled, (state) => {
        state.loadingCreateRoom = false;
      })
      .addCase(doCreateRoom.rejected, (state) => {
        state.loadingCreateRoom = false;
      });

    builder
      .addCase(doViewAllMessageInRoom.pending, (state) => {
      })
      .addCase(doViewAllMessageInRoom.fulfilled, (state, action: PayloadAction<IResMessage<IParamsMessageList>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          if (state.chatRoomList.data.length > 0) {
            const currentRoomIndex = state.chatRoomList.data.findIndex(item => item.id == data.room);
            if (currentRoomIndex >= 0) {
              state.chatRoomList.data[currentRoomIndex].messagesUnRead = 0;
            }
          }
        }
      })
      .addCase(doViewAllMessageInRoom.rejected, (state) => {

      });

    //doAddRoomMember
    builder
      .addCase(doAddRoomMember.pending, (state) => {
        state.isLoadingDetail = true;
      })
      .addCase(doAddRoomMember.fulfilled, (state, action: PayloadAction<IResRoomDetail>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.activeChatRoomData = payload.data;
        }
        state.isLoadingDetail = false;
      })
      .addCase(doAddRoomMember.rejected, (state) => {
        state.isLoadingDetail = false;
      });

    //doRemoveRoomMember
    builder
      .addCase(doRemoveRoomMember.pending, (state) => {
        state.isLoadingDetail = true;
      })
      .addCase(doRemoveRoomMember.fulfilled, (state, action: PayloadAction<IResRoomDetail>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.activeChatRoomData = payload.data;
        }
        state.isLoadingDetail = false;
      })
      .addCase(doRemoveRoomMember.rejected, (state) => {
        state.isLoadingDetail = false;
      });
  },
});

export const roomReducer = roomSlice.reducer;
export const roomActions = roomSlice.actions;