import { AxiosResponse } from "axios";
import { IParamLogin, IParamRefreshToken, IResLogin, IResRefreshToken } from "services/types/user";
import axiosMain from "../axios/axiosMain";

const basicUrl = 'auth/';

export const apiLogin = {
  login: (params: IParamLogin): Promise<AxiosResponse<IResLogin>> => {
    const url = basicUrl + 'login';
    return axiosMain.post(url, params);
  },
  refreshToken: (params: IParamRefreshToken): Promise<AxiosResponse<IResRefreshToken>> => {
    const url = basicUrl + 'refresh-token';
    return axiosMain.post(url, params);
  },
};
