import { message } from 'antd';
import { NotificationStatus, NotificationType } from "utils/contants";
import { IPaginationModel, IParamsPagination, IResponse } from "./common";
import { IRoomModel } from "./room";
import { IUserModel } from "./user";
import { IMessageModel } from './message';

// Param
export interface IParamGetListNotification extends IParamsPagination {

}

export interface IParamGetAllListNotification {
  status?: NotificationStatus;
}

export interface IParamGetNotificationDetail {
  id: string;
}
export interface IParamUpdateStatusNotification {
  id?: string;
  status?: NotificationStatus;
}

export interface IParamDeleteNotification {
  id?: string;
}

// Response
export interface IResNotification<T> extends IResponse {
  data: T;
}

export interface IResNotificationList extends IPaginationModel {
  data: INotificationModel[];
}

export interface IResNotificationListAll extends IResponse  {
  data: INotificationModel[];
}
export interface IResNotificationDetail extends IResponse  {
  data: INotificationModel;
}

export interface IResUpdateStatusNotification extends IResponse {
  data: string;
}

export interface IResDeleteNotification extends IResponse {
  data: string;
}

export interface IResUpdateReadAllNotification extends IResponse {

}

// Model
export interface INotificationModel {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  createdAt: Date;
  createdBy: IUserModel;
  receivedUser: IUserModel;
  room?: IRoomModel;
  message?: IMessageModel;
  status: NotificationStatus;
}
