import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAchievements,
  createAchievement,
  deleteAchievement,
} from "../../services/achievementService";

// Async thunks
export const fetchAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (jobId, { rejectWithValue }) => {
    try {
      return await getAchievements(jobId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Yutuqlar ro'yxatini olishda xatolik"
      );
    }
  }
);

export const addAchievement = createAsyncThunk(
  "achievements/add",
  async (data, { rejectWithValue }) => {
    try {
      return await createAchievement(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Yutuq qo'shishda xatolik"
      );
    }
  }
);

export const removeAchievement = createAsyncThunk(
  "achievements/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAchievement(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Yutuqni o'chirishda xatolik"
      );
    }
  }
);

// Initial state
const initialState = {
  achievements: [],
  loading: false,
  error: null,
};

// Slice
const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    clearAchievementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch achievements
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add achievement
      .addCase(addAchievement.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements.push(action.payload);
      })
      .addCase(addAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove achievement
      .addCase(removeAchievement.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = state.achievements.filter(
          (achievement) => achievement._id !== action.payload
        );
      })
      .addCase(removeAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAchievementError } = achievementSlice.actions;
export default achievementSlice.reducer;
