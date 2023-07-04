import { apiNotification } from './../../services/apiAction/apiNotification';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IParamDeleteNotification, IParamGetAllListNotification, IParamGetListNotification, IParamUpdateStatusNotification, IResNotificationList } from "services/types/notification";
import { EResponseResult } from 'utils/contants';

export const doGetNotificationList = createAsyncThunk(
  'notification/doGetNotificationList',
  async (params: IParamGetListNotification) => {
    const response = await apiNotification.getNotificationList(params);
    return response.data;
  }
);

export const doGetNotificationListMore = createAsyncThunk(
  'notification/doGetNotificationListMore',
  async (params: IParamGetListNotification) => {
    const response = await apiNotification.getNotificationList({ ...params });
    return response.data;
  }
);

export const doUpdateStatusNotification = createAsyncThunk(
  'notification/doUpdateStatusNotification',
  async (params: IParamUpdateStatusNotification) => {
    let notification = await apiNotification.updateStatusNotification(params);
    if (notification.data) {
      const response = await apiNotification.getNotificationDetail({ id: notification.data.data.toString() });
      return response.data;
    }
  }
);

export const doDeleteNotification = createAsyncThunk(
  'notification/doDeleteNotification',
  async (params: IParamDeleteNotification) => {
    let response = await apiNotification.deleteNotification(params);
    return response.data;
  }
);

export const doGetAllNotification = createAsyncThunk(
  'notification/doGetAllNotification',
  async (params: IParamGetAllListNotification) => {
    let response = await apiNotification.getAllNotification(params);
    return response.data;
  }
);

export const doUpdateReadAllNotification = createAsyncThunk(
  'notification/doUpdateReadAllNotification',
  async () => {
    let response = await apiNotification.updateReadAllNotification();
    return response.data;
  }
);