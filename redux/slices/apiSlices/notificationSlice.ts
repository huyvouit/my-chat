import { doDeleteNotification, doGetAllNotification, doGetNotificationList, doGetNotificationListMore, doUpdateReadAllNotification, doUpdateStatusNotification } from 'redux/asyncThunk/notificationAction';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPaginationModel } from "services/types/common";
import { INotificationModel, IResDeleteNotification, IResNotification, IResNotificationDetail, IResNotificationList, IResNotificationListAll } from "services/types/notification";
import { EResponseResult, NotificationStatus } from 'utils/contants';


interface IInitialState {
  notificationList: {
    data: INotificationModel[],
    pagination: IPaginationModel,
    loading: boolean,
  },
  countNotify: number,
}

const initialState = {
  notificationList: {
    data: [],
    pagination: {},
    loading: false,
  },
  countNotify: 0,
} as IInitialState;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setPushNewNotification: (state, action: PayloadAction<INotificationModel>) => {
      state.notificationList.data = [action.payload, ...state.notificationList.data];
    },
    updateNotification: (state, action: PayloadAction<number>) => {
      state.countNotify = state.countNotify + action.payload;
    },
  },
  extraReducers: (builder) => {
    //doGetNotificationList
    builder
      .addCase(doGetNotificationList.pending, (state) => {
        state.notificationList.loading = true;
      })
      .addCase(doGetNotificationList.fulfilled, (state, action: PayloadAction<IResNotification<IResNotificationList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          state.notificationList.data = data;
          state.notificationList.pagination = { ...pagination };
          state.notificationList.loading = false;
        }
      })
      .addCase(doGetNotificationList.rejected, (state) => {
        state.notificationList.loading = false;
      });

    //doGetNotificationListMore
    builder
      .addCase(doGetNotificationListMore.pending, (state) => {
        state.notificationList.loading = true;
      })
      .addCase(doGetNotificationListMore.fulfilled, (state, action: PayloadAction<IResNotification<IResNotificationList>>) => {
        const { result } = action.payload;
        const { data, ...pagination } = action.payload.data;
        if (result === EResponseResult.SUCCESS) {
          const notiListMore = data.filter((item) => !state.notificationList.data.find((noti) => noti.id === item.id));
          state.notificationList.data = [...state.notificationList.data, ...notiListMore];
          state.notificationList.pagination = { ...pagination };
          state.notificationList.loading = false;
        }
      })
      .addCase(doGetNotificationListMore.rejected, (state) => {
        state.notificationList.loading = false;
      });

    //doUpdateStatusNotification
    builder
      .addCase(doUpdateStatusNotification.pending, (state) => {
        state.notificationList.loading = true;
      })
      .addCase(doUpdateStatusNotification.fulfilled, (state, action: PayloadAction<IResNotificationDetail>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.notificationList.data = state.notificationList.data.map((item) => item.id === payload.data.id ? payload.data : item);
          state.notificationList.loading = false;
        }
      })
      .addCase(doUpdateStatusNotification.rejected, (state) => {
        state.notificationList.loading = false;
      });

    //doDeleteNotification
    builder
      .addCase(doDeleteNotification.pending, (state) => {
        state.notificationList.loading = true;
      })
      .addCase(doDeleteNotification.fulfilled, (state, action: PayloadAction<IResDeleteNotification>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.notificationList.data = state.notificationList.data.filter((item) => item.id !== payload.data);
          state.notificationList.pagination.pageSize = state.notificationList.pagination.pageSize - 1;
          state.notificationList.pagination.totalCount = state.notificationList.pagination.totalCount - 1;
          state.notificationList.loading = false;
        }
      })
      .addCase(doDeleteNotification.rejected, (state) => {
        state.notificationList.loading = false;
      });

    //doGetAllNotification
    builder
      .addCase(doGetAllNotification.fulfilled, (state, action: PayloadAction<IResNotificationListAll>) => {
        const payload = action.payload;
        if (payload.result === EResponseResult.SUCCESS) {
          state.countNotify = payload.data.filter((item) => item.status === NotificationStatus.UnRead).length;
        }
      })

    //doUpdateReadAllNotification
    builder
    .addCase(doUpdateReadAllNotification.pending, (state) => {
      state.notificationList.loading = true;
    })
    .addCase(doUpdateReadAllNotification.fulfilled, (state, action: PayloadAction<any>) => {
      const payload = action.payload;
      if (payload.result === EResponseResult.SUCCESS) {
        state.notificationList.data = state.notificationList.data.map((item) => item.status === NotificationStatus.UnRead ? { ...item, status: NotificationStatus.Read } : item);
        state.countNotify = 0;
        state.notificationList.loading = false;
      }
    })
    .addCase(doUpdateReadAllNotification.rejected, (state) => {
      state.notificationList.loading = false;
    });
  },
});

export const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;