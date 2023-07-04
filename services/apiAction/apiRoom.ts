import { AxiosResponse } from "axios";
import { IParamAddRoomMember, IParamCreateRoom, IParamDeleteRoom, IParamGetRoomDetail, IParamGetRoomList, IParamRemoveRoomMember, IResAddRoomMember, IResCreateRoom, IResDeleteRoom, IResRemoveRoomMember, IResRoom, IResRoomDetail, IResRoomList } from "services/types/room";
import axiosMain from "../axios/axiosMain";

const basicUrl = 'room/';

export const apiRoom = {
  getRoomList: (params: IParamGetRoomList): Promise<AxiosResponse<IResRoom<IResRoomList>>> => {
    const url = basicUrl + 'pagination';
    return axiosMain.get(url, {
      params: {
        pageSize: 10,
        ...params,
        // pageIndex: (params.pageIndex || 1) - 1,
      }
    });
  },
  getRoomDetail: (params: IParamGetRoomDetail): Promise<AxiosResponse<IResRoomDetail>> => {
    const url = basicUrl + params.id;
    return axiosMain.get(url);
  },
  createRoom: (params: IParamCreateRoom): Promise<AxiosResponse<IResCreateRoom>> => {
    const url = basicUrl;
    return axiosMain.post(url, params);
  },
  addRoomMember: (params: IParamAddRoomMember): Promise<AxiosResponse<IResAddRoomMember>> => {
    const url = basicUrl + 'add-member/' + params.roomId;
    return axiosMain.put(url, params);
  },
  removeRoomMember: (params: IParamRemoveRoomMember): Promise<AxiosResponse<IResRemoveRoomMember>> => {
    const url = basicUrl + 'remove-member/' + params.roomId;
    return axiosMain.put(url, params);
  },
  deleteRoom: (params: IParamDeleteRoom): Promise<AxiosResponse<IResDeleteRoom>> => {
    const url = basicUrl + params.id;
    return axiosMain.delete(url);
  },
};
