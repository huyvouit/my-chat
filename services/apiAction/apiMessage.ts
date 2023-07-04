import { AxiosResponse } from "axios";
import { IMessageModel, IParamsCreateNewMessage, IParamsMessageList, IParamsRemoveMessage, IParamsUpdateMessage, IParamsViewAllMessageInRoom, IParamsViewNewMessage, IResMessage, IResMessageList } from "services/types/message";
import axiosMain from "../axios/axiosMain";

const basicUrl = 'message/';

export const apiMessage = {
  getMessagePaginationList: (params: IParamsMessageList): Promise<AxiosResponse<IResMessage<IResMessageList>>> => {
    const url = basicUrl + "pagination";
    return axiosMain.get(url, { params });
  },

  createNewMessage: (params: IParamsCreateNewMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const url = basicUrl + "create";
    return axiosMain.post(url, params);
  },
  updateMessage: (params: IParamsUpdateMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const url = basicUrl + params.id;
    return axiosMain.put(url, params);
  },
  removeMessage: (params: IParamsRemoveMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const { id, ...rest } = params;
    const url = basicUrl + id;
    return axiosMain.delete(url, { params: { ...rest } });
  },
  removeMessageByOwner: (params: IParamsRemoveMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const { id, ...rest } = params;
    const url = basicUrl + `remove-owner/${id}`;
    return axiosMain.put(url);
  },
  removeMessageForAll: (params: IParamsRemoveMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const { id, ...rest } = params;
    const url = basicUrl + `remove-all/${id}`;
    return axiosMain.put(url);
  },

  viewNewMessage: (params: IParamsViewNewMessage): Promise<AxiosResponse<IResMessage<IMessageModel>>> => {
    const url = basicUrl + "view/" + params.id;
    return axiosMain.put(url);
  },

  viewAllMessageInRoom: (params: IParamsViewAllMessageInRoom): Promise<AxiosResponse<IResMessage<IParamsMessageList>>> => {
    const url = basicUrl + "view-room/" + params.room;
    return axiosMain.put(url);
  },
};
