import { IParamAddRoomMember, IParamCreateRoom, IParamDeleteRoom, IParamFindRoomChat, IParamGetRoomDetail, IParamGetRoomList, IParamRemoveRoomMember } from 'services/types/room';
import { createAsyncThunk } from "@reduxjs/toolkit"
import { apiRoom } from 'services/apiAction/apiRoom';

export const doGetRoomList = createAsyncThunk(
  'room/doGetRoomList',
  async (params: IParamGetRoomList) => {
    const response = await apiRoom.getRoomList(params);
    return response.data;
  }
);

export const doGetRoomListMore = createAsyncThunk(
  'room/doGetRoomListMore',
  async (params: IParamGetRoomList) => {
    const response = await apiRoom.getRoomList({ ...params });
    return response.data;
  }
);

export const doGetRoomDetail = createAsyncThunk(
  'room/doGetRoomDetail',
  async (params: IParamGetRoomDetail) => {
    const response = await apiRoom.getRoomDetail(params);
    return response.data;
  }
);

export const doFindRoomChatInDatabase = createAsyncThunk(
  'room/doFindRoomChatInDatabase',
  async (params: IParamFindRoomChat) => {
    const myParam = { ...params };

    const findInApi = async (params: IParamFindRoomChat) => {
      const { response, roomId, ...query } = params;
      const res = (await apiRoom.getRoomList(query)).data.data;
      const { data, ...pagination } = res;

      if (data.length === 0) {
        return params;
      }

      params.response = {
        ...pagination,
        data: [...(params.response?.data || []), ...data],
      }

      const temp = data.find((item) => item.id === roomId);
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

export const doCreateRoom = createAsyncThunk(
  'room/doCreateRoom',
  async (params: IParamCreateRoom) => {
    let room = await apiRoom.createRoom(params);
    if (room.data) {
      const newRoom = await apiRoom.getRoomDetail({ id: room.data.data.toString() });
      return newRoom.data;
    }
  }
);

export const doAddRoomMember = createAsyncThunk(
  'room/doAddRoomMember',
  async (params: IParamAddRoomMember) => {
    let room = await apiRoom.addRoomMember(params);
    if (room.data) {
      const newRoom = await apiRoom.getRoomDetail({ id: room.data.data.toString() });
      return newRoom.data;
    }
  }
);

export const doRemoveRoomMember = createAsyncThunk(
  'room/doRemoveRoomMember',
  async (params: IParamRemoveRoomMember) => {
    let room = await apiRoom.removeRoomMember(params);
    if (room.data) {
      const newRoom = await apiRoom.getRoomDetail({ id: room.data.data.toString() });
      return newRoom.data;
    }
  }
);

export const doDeleteRoom = createAsyncThunk(
  'room/doDeleteRoom',
  async (params: IParamDeleteRoom) => {
    let response = await apiRoom.deleteRoom(params);
    return response.data;
  }
);