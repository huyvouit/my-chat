import { IParamDeleteNotification, IParamGetAllListNotification, IParamGetNotificationDetail, IParamUpdateStatusNotification, IResDeleteNotification, IResNotification, IResNotificationDetail, IResNotificationListAll, IResUpdateReadAllNotification, IResUpdateStatusNotification } from './../types/notification';

import axiosMain from "../axios/axiosMain";
import { AxiosResponse } from 'axios';
import { IParamGetListNotification, IResNotificationList } from "services/types/notification";

const basicUrl = 'notification/';

export const apiNotification = {
  getNotificationList: (params: IParamGetListNotification): Promise<AxiosResponse<IResNotification<IResNotificationList>>> => {
    const url = basicUrl + 'pagination';
    return axiosMain.get(url, {
      params: {
        pageSize: 10,
        ...params,
      }
    });
  },

  getAllNotification: (params: IParamGetAllListNotification): Promise<AxiosResponse<IResNotificationListAll>> => {
    const url = basicUrl;
    return axiosMain.get(url, { params });
  },

  getNotificationDetail: (params: IParamGetNotificationDetail): Promise<AxiosResponse<IResNotificationDetail>> => {
    const url = basicUrl + params.id;
    return axiosMain.get(url);
  },

  updateStatusNotification: (params: IParamUpdateStatusNotification): Promise<AxiosResponse<IResUpdateStatusNotification>> => {
    const url = basicUrl + 'update-status/' + params.id;
    return axiosMain.put(url, params);
  },

  deleteNotification: (params: IParamDeleteNotification): Promise<AxiosResponse<IResDeleteNotification>> => {
    const url = basicUrl + params.id;
    return axiosMain.delete(url);
  },

  updateReadAllNotification: (): Promise<AxiosResponse<IResUpdateReadAllNotification>> => {
    const url = basicUrl + 'read-all';
    return axiosMain.put(url);
  },
};
