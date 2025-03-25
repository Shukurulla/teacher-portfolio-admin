import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activePage: "Bosh sahifa",
  },
  reducers: {
    changePage: (state, action) => {
      state.activePage = action.payload;
    },
  },
});

export const { changePage } = uiSlice.actions;

export default uiSlice.reducer;
