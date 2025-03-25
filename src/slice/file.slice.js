import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
  name: "file",
  initialState: {
    isLoading: false,
    myFiles: [],
  },
  reducers: {
    getFilesStart: (state) => {
      state.isLoading = true;
    },
    getFilesSuccess: (state, action) => {
      state.isLoading = false;
      state.myFiles = action.payload;
    },
    getFilesFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getFilesFailure, getFilesStart, getFilesSuccess } =
  fileSlice.actions;

export default fileSlice.reducer;
