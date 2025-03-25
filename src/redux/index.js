import { configureStore } from "@reduxjs/toolkit";
import FileReducer from "../slice/file.slice.js";
import AdminReducer from "../slice/admin.slice.js";
import UiReducer from "../slice/ui.slice.js";

const store = configureStore({
  reducer: {
    file: FileReducer,
    admin: AdminReducer,
    ui: UiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
