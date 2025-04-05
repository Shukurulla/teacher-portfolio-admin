import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getJobById } from "../../services/jobService";

// Async thunks
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getJobById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ish ma'lumotlarini olishda xatolik"
      );
    }
  }
);

// Initial state
const initialState = {
  currentJob: null,
  jobFiles: [],
  loading: false,
  error: null,
};

// Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
      state.jobFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.data.job;
        state.jobFiles = action.payload.data.files;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
