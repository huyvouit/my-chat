import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessageModel } from 'services/types/message';

interface TInitialState {
  socketId: string;
  isEstablishingConnection: boolean;
  isConnected: boolean;
  messages: IMessageModel[];
}

const initialState = {
  socketId: '',
  isEstablishingConnection: false,
  isConnected: false,
  messages: [],
} as TInitialState;

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    connectionFailed: (state) => {
      state.socketId = '',
        state.isConnected = false;
      state.isEstablishingConnection = false;
    },
    receiveMessage: (state, action: PayloadAction<IMessageModel>) => {
      state.messages.push(action.payload);
    },
    seenMessage: (state, action: PayloadAction<IMessageModel>) => {
      state.messages.push(action.payload);
    },
    submitMessage: (state, action: PayloadAction<IMessageModel>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {

  },
});

export const socketReducer = socketSlice.reducer;

export const socketActions = socketSlice.actions;