import { configureStore } from '@reduxjs/toolkit';
import socketMiddleware from 'utils/middlewares/socket.middleware';
import rootReducer from '../reducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ 
    serializableCheck: false 
  }).concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;