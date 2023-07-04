import { createAsyncThunk } from "@reduxjs/toolkit"
import { IParamLogin, IParamRefreshToken } from "services/types/user";
import { apiLogin } from "../../services/apiAction/apiLogin";

export const doLogin = createAsyncThunk(
  'login/doLogin',
  async (params: IParamLogin) => {
    const response = await apiLogin.login(params);
    return response.data;
  }
);

export const doRefreshToken = createAsyncThunk(
  'login/doRefreshToken',
  async (params: IParamRefreshToken) => {
    const response = await apiLogin.refreshToken(params);
    return response.data;
  }
);