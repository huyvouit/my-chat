import { createAsyncThunk } from "@reduxjs/toolkit";
import { socketActions } from "redux/slices/appSlices/socketSlice";
import { IParamGetListUser, IParamGetUserDetail, IParamGetUserInfo, IParamRegister, IResGetListUser, IResGetUserDetail } from "services/types/user";
import { apiUser } from "../../services/apiAction/apiUser";

export const doGetUserInfo = createAsyncThunk(
  'user/doGetUserInfo',
  async (params: IParamGetUserInfo, _thunkAPI) => {
    const { data } = await apiUser.getUserInfo(params);
    if(data && data.data) {
      _thunkAPI.dispatch(socketActions.startConnecting());
    }
    return data;
  }
);

export const doRegister = createAsyncThunk(
  'user/doRegister',
  async (params: IParamRegister) => {
    const response = await apiUser.register(params);
    return response.data;
  }
)

export const doGetListUser = createAsyncThunk(
  'user/doGetListUser',
  async (params: IParamGetListUser): Promise<IResGetListUser> => {
    const response = await apiUser.getListUser(params);
    return response.data;
  }
)

export const doGetUserDetail = createAsyncThunk(
  'user/doGetUserDetail',
  async (params: IParamGetUserDetail): Promise<IResGetUserDetail> => {
    const response = await apiUser.getUserDetail(params);
    return response.data;
  }
)