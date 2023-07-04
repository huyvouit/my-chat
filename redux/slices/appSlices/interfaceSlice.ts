import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TInitialState {

}

const initialState = {
  response: {},
} as TInitialState;

const interfaceSlice = createSlice({
  name: 'interface',
  initialState: initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    
  },
});

export const interfaceReducer = interfaceSlice.reducer;

export const interfaceActions = interfaceSlice.actions;