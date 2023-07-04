import { message } from 'antd';
import { IMessageModel } from 'services/types/message';
import { NormalStatus, ERoomRole, ERoomType } from "utils/contants";
import { IPaginationModel, IParamsPagination, IResponse } from "./common";

// Param
export interface IParamGetRoomList extends IParamsPagination {
  text?: string;
}

export interface IParamGetRoomDetail {
  id: string;
}

export interface IParamFindRoomChat extends IParamsPagination {
  roomId: string;
  response: IResRoomList;
}

export interface IParamCreateRoom {
  name?: string;
  type: ERoomType;
  users?: string[];
}

export interface IParamAddRoomMember {
  roomId: string;
  userIds?: string[];
}

export interface IParamRemoveRoomMember {
  roomId: string;
  userIds?: string[];
}

export interface IParamDeleteRoom {
  id?: string;
}

// Response
export interface IResRoom<T> extends IResponse {
  data: T;
}

export interface IResRoomList extends IPaginationModel {
  data: IRoomModel[];
}

export interface IResRoomDetail extends IResponse {
  data: IRoomModel;
}

export interface IResCreateRoom extends IResponse {
  data: string;
}

export interface IResAddRoomMember extends IResponse {
  data: string;
}

export interface IResRemoveRoomMember extends IResponse {
  data: string;
}

export interface IResDeleteRoom extends IResponse {
  data: string;
}

export interface IUsersInRoom {
  id: string;
  name: string;
  email: string;
  role: ERoomRole;
}

// Model
export interface IRoomModel {
  id: string;
  name: string;
  messages?: IMessageModel[];
  users?: IUsersInRoom[];
  type: ERoomType;
  status: NormalStatus;
  messagesUnRead?: number;
}

export interface IRoomLastMessageModel extends IRoomModel {
  message: IMessageModel;
}