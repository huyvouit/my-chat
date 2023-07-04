import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthentication, IResLogin, IResRefreshToken } from 'services/types/user';
import { common } from 'utils/common';
import { EResponseResult } from '../../../utils/contants';
import { doLogin, doRefreshToken } from '../../asyncThunk/loginAction';
import { setMainToken } from '../appSlices/authSlice';

interface TInitialState {
  authentication: IAuthentication;
  isLoading: boolean,
}

const initialState = {
  authentication: {},
  isLoading: false,
} as TInitialState;

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    //doLogin
    builder
      .addCase(doLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(doLogin.fulfilled, (state, action: PayloadAction<IResLogin>) => {
        const { data } = action.payload;
        common.setToken(data.token);
        // common.setRefreshToken(payload.data.refreshToken);
        setMainToken(data.token);
        state.authentication = data;
        state.isLoading = false;
      })
      .addCase(doLogin.rejected, (state) => {
        state.isLoading = false;
      });

    //doRefreshToken
    builder
      .addCase(doRefreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(doRefreshToken.fulfilled, (state, action: PayloadAction<IResRefreshToken>) => {
        const payload = action.payload;
        if(payload.result === EResponseResult.SUCCESS) {
          common.setToken(payload.data.accessToken);
          common.setRefreshToken(payload.data.refreshToken);
          setMainToken(payload.data.accessToken);
        }
        state.isLoading = false;
      })
      .addCase(doRefreshToken.rejected, (state) => { 
        state.isLoading = false;
      });
  },
});

export const loginReducer = loginSlice.reducer;