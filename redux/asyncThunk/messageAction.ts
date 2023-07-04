import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { apiMessage } from "services/apiAction/apiMessage";
import { IMessageModel, IParamsCreateNewMessage, IParamsFindMessageInDB, IParamsMessageList, IParamsRemoveMessage, IParamsUpdateMessage, IParamsViewAllMessageInRoom, IParamsViewNewMessage, IResMessage, IResMessageList } from "services/types/message";

export const doGetMessagePaginationList = createAsyncThunk(
  'message/doGetMessagePaginationList',
  async (params: IParamsMessageList) => {
    const response = await apiMessage.getMessagePaginationList({
      ...params,
      pageSize: 20,
      pageIndex: (params.pageIndex || 1) - 1,
    });
    return response.data;
  }
);

export const doGetMessagePaginationListMore = createAsyncThunk(
  'message/doGetMessagePaginationListMore',
  async (params: IParamsMessageList) => {
    const response = await apiMessage.getMessagePaginationList({
      ...params,
      pageSize: 20,
      pageIndex: (params.pageIndex || 1) - 1,
    });
    return response.data;
  }
);

export const doGetMessagePaginationListByKeyword = createAsyncThunk(
  'message/doGetMessagePaginationListByKeyword',
  async (params: IParamsMessageList) => {
    const response = await apiMessage.getMessagePaginationList({
      ...params,
      text: params.text,
      pageSize: 20,
      pageIndex: (params.pageIndex || 1) - 1,
    });
    return response.data;
  }
);

export const doGetMessagePaginationListByKeywordMore = createAsyncThunk(
  'message/doGetMessagePaginationListByKeywordMore',
  async (params: IParamsMessageList) => {
    const response = await apiMessage.getMessagePaginationList({
      ...params,
      text: params.text,
      pageSize: 20,
      pageIndex: (params.pageIndex || 1) - 1,
    });
    return response.data;
  }
);
export const doFindMessageInDatabase = createAsyncThunk(
  "referral/doFindMessageInDatabase",
  async (params: IParamsFindMessageInDB) => {
    const myParam = { ...params };
    const findInApi: any = async (params: IParamsFindMessageInDB) => {
      const query = {
        pageIndex: params.pageIndex,
        pageSize: 20,
        room: params.room
      }
      const resApi: AxiosResponse<IResMessage<IResMessageList>> = await apiMessage.getMessagePaginationList(query);
      const { data, ...pagination } = resApi.data.data;
      params.response = {
        ...pagination,
        data: [...(params.response.data || []), ...data],
      };
      const temp = data.find((item) => item.id === params.messageId);
      if (!!temp && !!temp.id) {
        return params;
      } else {
        return findInApi({
          ...params,
          pageIndex: (params.pageIndex || 0) + 1,
        });
      }
    };

    const result = await findInApi(myParam);
    return result.response;
  }
);

export const doCreateNewMessage = createAsyncThunk(
  'message/doCreateNewMessage',
  async (params: IMessageModel) => {
    const response = await apiMessage.createNewMessage(params);
    return {
      ...response.data,
      data: { ...response.data.data, uuid: params.uuid }
    };
  }
);

export const doUpdateMessage = createAsyncThunk(
  'message/doUpdateMessage',
  async (params: IParamsUpdateMessage) => {
    const response = await apiMessage.updateMessage(params);
    return response.data;
  }
);

export const doRemoveMessage = createAsyncThunk(
  'message/doRemoveMessage',
  async (params: IParamsRemoveMessage) => {
    const response = await apiMessage.removeMessage(params);
    return response.data;
  }
);

export const doRemoveMessageByOwner = createAsyncThunk(
  'message/doRemoveMessageByOwner',
  async (params: IParamsRemoveMessage) => {
    const response = await apiMessage.removeMessageByOwner(params);
    return response.data;
  }
);
export const doRemoveMessageForAll = createAsyncThunk(
  'message/doRemoveMessageForAll',
  async (params: IParamsRemoveMessage) => {
    const response = await apiMessage.removeMessageForAll(params);
    return response.data;
  }
);

export const doViewNewMessage = createAsyncThunk(
  'message/doViewNewMessage',
  async (params: IParamsViewNewMessage) => {
    const response = await apiMessage.viewNewMessage(params);
    return response.data;
  }
);

export const doViewAllMessageInRoom = createAsyncThunk(
  'message/doViewAllMessageInRoom',
  async (params: IParamsViewAllMessageInRoom) => {
    const response = await apiMessage.viewAllMessageInRoom(params);
    return response.data;
  }
);