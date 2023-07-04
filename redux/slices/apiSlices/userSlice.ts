import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doGetUserInfo } from 'redux/asyncThunk/userAction';
import { IResGetUserInfo, IUserModel } from 'services/types/user';
import { EResponseResult } from 'utils/contants';

interface TInitialState {
  userInfo: IUserModel;
  isLoadingGetUserInfo: boolean,
}

const initialState = {
  userInfo: {} as IUserModel,
  isLoadingGetUserInfo: true,
} as TInitialState;

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    //doGetUserInfo
    builder
      .addCase(doGetUserInfo.pending, (state) => {
        state.isLoadingGetUserInfo = true;
      })
      .addCase(doGetUserInfo.fulfilled, (state, action: PayloadAction<IResGetUserInfo>) => {
        const { result, data } = action.payload;
        if (result === EResponseResult.SUCCESS) {
          state.userInfo = { ...data };
          state.isLoadingGetUserInfo = false;
        }

      })
      .addCase(doGetUserInfo.rejected, (state) => {
        state.isLoadingGetUserInfo = false;
      });
  },
});

export const userReducer = userSlice.reducer;