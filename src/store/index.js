import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import teacherReducer from "./slices/teacherSlice";
import fileReducer from "./slices/fileSlice";
import jobReducer from "./slices/jobSlice";
import achievementReducer from "./slices/achievementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teacherReducer,
    files: fileReducer,
    jobs: jobReducer,
    achievements: achievementReducer,
  },
});

export default store;
