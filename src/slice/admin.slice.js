import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isLoading: false,
    admin: {},
  },
  reducers: {
    getAdminStart: (state) => {
      state.isLoading = true;
    },
    getAdminSuccess: (state, action) => {
      state.admin = action.payload;
      state.isLoading = false;
    },
    getAdminFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getAdminFailure, getAdminStart, getAdminSuccess } =
  adminSlice.actions;

export default adminSlice.reducer;
