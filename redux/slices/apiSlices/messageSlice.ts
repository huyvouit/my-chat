import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doCreateNewMessage, doFindMessageInDatabase, doGetMessagePaginationList, doGetMessagePaginationListByKeyword, doGetMessagePaginationListByKeywordMore, doGetMessagePaginationListMore, doRemoveMessage, doRemoveMessageByOwner, doRemoveMessageForAll, doUpdateMessage, doViewAllMessageInRoom, doViewNewMessage } from 'redux/asyncThunk/messageAction';
import { IPaginationModel } from 'services/types/common';
import { IMessageModel, IResMessage, IResMessageList } from 'services/types/message';
import { EResponseResult, MessageStatus } from 'utils/contants';

interface IInitialState {
  isLoading: boolean,
  isLoadingDetail: boolean,
  messageByRoomList: {
    data: IMessageModel[],
    pagination: IPaginationModel,
    loading: boolean,
  },
  messageSearchByKeywordList: {
    selectedMessage: IMessageModel,
    data: IMessageModel[],
    pagination: IPaginationModel,
    loading: boolean,
  },
  keywordSearchInRoom: string,
  repliedMessageSelected: IMessageModel,
  isLoadingCreateMessage: boolean,
  isLoadingUpdateMessage: boolean,
  isLoadingRemoveMessage: boolean,
}

const initialState = {
  isLoading: false,
  isLoadingDetail: false,
  messageByRoomList: {
    data: [],
    pagination: {},
    loading: false,
  },
  messageSearchByKeywordList: {
    selectedMessage: {},
    data: [],
    pagination: {},
    loading: false,
  },
  keywordSearchInRoom: undefined,
  repliedMessageSelected: {} as IMessageModel,
  isLoadingCreateMessage: false,
  isLoadingUpdateMessage: false,
  isLoadingRemoveMessage: false,
} as IInitialState;

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    setRepliedMessage: (state, actions: PayloadAction<IMessageModel>) => {
      state.repliedMessageSelected = actions.payload;
    },
    setKeywordSearchInRoom: (state, actions: PayloadAction<string>) => {
      state.keywordSearchInRoom = actions.payload;
    },
    setClearDataMessageSearchList: (state) => {
      state.messageSearchByKeywordList.selectedMessage = {} as IMessageModel;
      state.messageSearchByKeywordList.data = [];
      state.messageSearchByKeywordList.pagination = {} as IPaginationModel;
      state.messageSearchByKeywordList.loading = false;
    },
    setTempMessage: (state, actions: PayloadAction<IMessageModel>) => {
      const payload = actions.payload;
      if (payload) {
        state.messageByRoomList.data = [(payload || {} as IMessageModel), ...(state.messageByRoomList.data || [])];
        state.messageByRoomList.pagination.totalCount++;
      }
    },
    setUpdateTempMessage: (state, actions: PayloadAction<IMessageModel>) => {
      const payload = actions.payload;
      if (payload) {
        state.messageByRoomList.data = state.messageByRoomList.data.map(item => {
          if (item.id === payload.id) {
            return { ...item, text: payload.text };
          }
          return item;
        });
      }
    },
    setDeleteTempMessage: (state, actions: PayloadAction<IMessageModel>) => {
      const payload = actions.payload;
      if (payload) {
        state.messageByRoomList.data = state.messageByRoomList.data.filter(item => item.id !== payload.id);
      }
    },
    setDeteleTempMessageForAll: (state, actions: PayloadAction<IMessageModel>) => {
      const payload = actions.payload;
      if (payload) {
        state.messageByRoomList.data = state.messageByRoomList.data.map(item => {
          if (item.id === payload.id) {
            return {
              ...item,
              text: "This message was removed",
              status: MessageStatus.InActive,
            };
          }
          return {
            ...item,
            repliedMessage: {
              ...item.repliedMessage, status: MessageStatus.InActive,
            }
          };
        });
      }
    },
    setSelectedMessageSearch: (state, actions: PayloadAction<IMessageModel>) => {
      state.messageSearchByKeywordList.selectedMessage = actions.payload;
    },
  },
  extraReducers: (builder) => {
    //doGetMessageList
    builder
      .addCase(doGetMessagePaginationList.pending, (state) => {
        state.messageByRoomList.loading = true;
      })
      .addCase(doGetMessagePaginationList.fulfilled, (state, action: PayloadAction<IResMessage<IResMessageList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          state.messageByRoomList.data = data;
          state.messageByRoomList.pagination = { ...pagination };
          state.messageByRoomList.loading = false;
        }
      })
      .addCase(doGetMessagePaginationList.rejected, (state) => {
        state.messageByRoomList.loading = false;
      });
    //doGetMessageList
    builder
      .addCase(doGetMessagePaginationListMore.pending, (state) => {
        state.messageByRoomList.loading = true;
      })
      .addCase(doGetMessagePaginationListMore.fulfilled, (state, action: PayloadAction<IResMessage<IResMessageList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          state.messageByRoomList.data = [...state.messageByRoomList.data, ...data];
          state.messageByRoomList.pagination = { ...pagination };
          state.messageByRoomList.loading = false;
        }
      })
      .addCase(doGetMessagePaginationListMore.rejected, (state) => {
        state.messageByRoomList.loading = false;
      });

    //get message by keywords
    builder
      .addCase(doGetMessagePaginationListByKeyword.pending, (state) => {
        state.messageSearchByKeywordList.loading = true;
      })
      .addCase(doGetMessagePaginationListByKeyword.fulfilled, (state, action: PayloadAction<IResMessage<IResMessageList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS && data) {
          state.messageSearchByKeywordList.data = data;
          state.messageSearchByKeywordList.selectedMessage = data[0];
          state.messageSearchByKeywordList.pagination = { ...pagination };
          state.messageSearchByKeywordList.loading = false;
        }
      })
      .addCase(doGetMessagePaginationListByKeyword.rejected, (state) => {
        state.messageSearchByKeywordList.loading = false;
      });

    builder
      .addCase(doGetMessagePaginationListByKeywordMore.pending, (state) => {
        state.messageSearchByKeywordList.loading = true;
      })
      .addCase(doGetMessagePaginationListByKeywordMore.fulfilled, (state, action: PayloadAction<IResMessage<IResMessageList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          state.messageSearchByKeywordList.data = [...state.messageSearchByKeywordList.data, ...data];
          state.messageSearchByKeywordList.pagination = { ...pagination };
          state.messageSearchByKeywordList.loading = false;
        }
      })
      .addCase(doGetMessagePaginationListByKeywordMore.rejected, (state) => {
        state.messageSearchByKeywordList.loading = false;
      });

    builder
      .addCase(doCreateNewMessage.pending, (state) => {
        state.isLoadingCreateMessage = true;
      })
      .addCase(doCreateNewMessage.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.messageByRoomList.data = state.messageByRoomList.data.map(item => {
            if (item.uuid === data.uuid) {
              return { ...data, id: data.id, pending: false };
            }
            return item;
          });
          state.isLoadingCreateMessage = false;
        }
      })
      .addCase(doCreateNewMessage.rejected, (state) => {
        state.isLoadingCreateMessage = false;
      });

    //update message
    builder
      .addCase(doUpdateMessage.pending, (state) => {
        state.isLoadingUpdateMessage = true;
      })
      .addCase(doUpdateMessage.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.isLoadingUpdateMessage = false;
        }
      })
      .addCase(doUpdateMessage.rejected, (state) => {
        state.isLoadingUpdateMessage = false;
      });

    //remove message
    builder
      .addCase(doRemoveMessage.pending, (state) => {
        state.isLoadingRemoveMessage = true;
      })
      .addCase(doRemoveMessage.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.messageByRoomList.data = state.messageByRoomList.data.filter(item => item.id != data.id);
          state.isLoadingRemoveMessage = false;
        }
      })
      .addCase(doRemoveMessage.rejected, (state) => {
        state.isLoadingRemoveMessage = false;
      });

    builder
      .addCase(doRemoveMessageByOwner.pending, (state) => {
        state.isLoadingRemoveMessage = true;
      })
      .addCase(doRemoveMessageByOwner.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.messageByRoomList.data = state.messageByRoomList.data.filter(item => item.id != data.id);
          state.isLoadingRemoveMessage = false;
        }
      })
      .addCase(doRemoveMessageByOwner.rejected, (state) => {
        state.isLoadingRemoveMessage = false;
      });

    builder
      .addCase(doRemoveMessageForAll.pending, (state) => {
        state.isLoadingRemoveMessage = true;
      })
      .addCase(doRemoveMessageForAll.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.isLoadingRemoveMessage = false;
        }
      })
      .addCase(doRemoveMessageForAll.rejected, (state) => {
        state.isLoadingRemoveMessage = false;
      });

    builder
      .addCase(doFindMessageInDatabase.pending, (state) => {
        state.messageByRoomList.loading = true;
      })
      .addCase(doFindMessageInDatabase.fulfilled, (state, action: PayloadAction<IResMessageList>) => {
        const { data, ...pagination } = action.payload;
        state.messageByRoomList.data = [...state.messageByRoomList.data, ...data,];
        state.messageByRoomList.pagination = { ...pagination };
        state.messageByRoomList.loading = false;
      })
      .addCase(doFindMessageInDatabase.rejected, (state) => {
        state.isLoadingCreateMessage = false;
      });

    builder
      .addCase(doViewNewMessage.pending, (state) => {
        state.isLoadingUpdateMessage = true;
      })
      .addCase(doViewNewMessage.fulfilled, (state, action: PayloadAction<IResMessage<IMessageModel>>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          console.log("ok đã xem tin nhắn mới")
        }
      })
      .addCase(doViewNewMessage.rejected, (state) => {
        state.isLoadingUpdateMessage = false;
      });
  },
});

export const messageReducer = messageSlice.reducer;

export const messageActions = messageSlice.actions;