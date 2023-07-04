import { roomReducer } from './../slices/apiSlices/roomSlice';
import { combineReducers } from "@reduxjs/toolkit";
import { socketReducer } from "redux/slices/appSlices/socketSlice";
import { loginReducer } from "../slices/apiSlices/loginSlice";
import { userReducer } from "../slices/apiSlices/userSlice";
import { authReducer } from "../slices/appSlices/authSlice";
import { interfaceReducer } from "../slices/appSlices/interfaceSlice";
import { messageReducer } from 'redux/slices/apiSlices/messageSlice';
import { notificationReducer } from 'redux/slices/apiSlices/notificationSlice';

const rootReducer = combineReducers({
  login: loginReducer,
  auth: authReducer,
  user: userReducer,
  interface: interfaceReducer,
  socket: socketReducer,
  room: roomReducer,
  message: messageReducer,
  notification: notificationReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;