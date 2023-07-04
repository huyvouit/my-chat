import { IParamGetUserDetail, IResGetListUser, IResGetUserDetail } from './../types/user';
import { IParamGetListUser, IParamGetUserInfo, IParamRegister } from "services/types/user";
import axiosMain from "../axios/axiosMain";
import { AxiosResponse } from 'axios';

const basicUrl = 'users/';

export const apiUser = {
  getUserInfo: (params: IParamGetUserInfo): Promise<AxiosResponse<IResGetUserDetail>> => {
    const url = 'auth/get-info';
    return axiosMain.get(url, {
      params: params,
    });
  },
  register: (params: IParamRegister) => {
    const url = 'auth/register';
    return axiosMain.post(url, params);
  },
  getListUser: (params: IParamGetListUser): Promise<AxiosResponse<IResGetListUser>> => {
    const url = basicUrl + `list`;
    return axiosMain.post(url, params);
  },
  getUserDetail: (params: IParamGetUserDetail): Promise<AxiosResponse<IResGetUserDetail>> => {
    const url = basicUrl + 'detail';
    return axiosMain.post(url, params);
  },
};
