import { IUserModel } from './user';
import { IPaginationModel, IParamsPagination, IResponse } from "./common";
import { MessageStatus, MessageType } from 'utils/contants';
import { IFileStoreModel } from './file-store';

export interface IResMessage<T> extends IResponse {
  data?: T;
}
export interface IMessageModel {
  id?: string;
  text?: string;
  type: MessageType;
  file?: IFileStoreModel;
  fileId?: string,
  createdAt: Date;
  createdBy?: IUserModel;
  room: string | string[];
  repliedMessage?: IMessageModel,
  readByRecipent?: IUserModel[],
  uuid?: string;
  repliedMessageId?: string;
  status?: MessageStatus;
  pending?: boolean;
}

export interface IParamsMessageList extends IParamsPagination {
  text?: string;
  type?: MessageType;
  room: string | string[];
}

export interface IResMessageList extends IPaginationModel {
  data: IMessageModel[];
}

export interface IParamsCreateNewMessage {
  text?: string;
  type?: MessageType;
  room: string | string[];
  repliedMessage?: IMessageModel,
  repliedMessageId?: string;
  uuid?: string;
  createdAt?: Date;
  createdBy?: IUserModel;
}

export interface IParamsRemoveMessage {
  id: string;
  room?: string | string[];
}

export interface IParamsUpdateMessage {
  id: string;
  text?: string;
}

export interface IParamsFindMessageInDB extends IParamsMessageList {
  messageId: string;
  response: IResMessageList,
}

export interface IParamsViewNewMessage {
  id: string;
}

export interface IParamsViewAllMessageInRoom {
  room: string | string[];
}