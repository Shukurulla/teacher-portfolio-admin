import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTeachers,
  getTeacherById,
  getTeacherJobs,
  getTeacherAchievements,
  deleteTeacher,
} from "../../services/teacherService";

// Async thunks
export const fetchAllTeachers = createAsyncThunk(
  "teachers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllTeachers();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "O'qituvchilar ro'yxatini olishda xatolik"
      );
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  "teachers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getTeacherById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "O'qituvchi ma'lumotlarini olishda xatolik"
      );
    }
  }
);

export const fetchTeacherJobs = createAsyncThunk(
  "teachers/fetchJobs",
  async (teacherId, { rejectWithValue }) => {
    try {
      return await getTeacherJobs(teacherId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "O'qituvchi ish joylarini olishda xatolik"
      );
    }
  }
);

export const fetchTeacherAchievements = createAsyncThunk(
  "teachers/fetchAchievements",
  async (teacherId, { rejectWithValue }) => {
    try {
      return await getTeacherAchievements(teacherId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "O'qituvchi yutuqlarini olishda xatolik"
      );
    }
  }
);

export const removeTeacher = createAsyncThunk(
  "teachers/remove",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteTeacher(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "O'qituvchini o'chirishda xatolik"
      );
    }
  }
);

// Initial state
const initialState = {
  teachers: [],
  currentTeacher: null,
  teacherJobs: [],
  teacherAchievements: [],
  loading: false,
  error: null,
};

// Slice
const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    clearTeacherError: (state) => {
      state.error = null;
    },
    clearCurrentTeacher: (state) => {
      state.currentTeacher = null;
      state.teacherJobs = [];
      state.teacherAchievements = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teachers
      .addCase(fetchAllTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch teacher jobs
      .addCase(fetchTeacherJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherJobs = action.payload;
      })
      .addCase(fetchTeacherJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch teacher achievements
      .addCase(fetchTeacherAchievements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherAchievements = action.payload;
      })
      .addCase(fetchTeacherAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove teacher
      .addCase(removeTeacher.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = state.teachers.filter(
          (teacher) => teacher._id !== action.meta.arg
        );
      })
      .addCase(removeTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeacherError, clearCurrentTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
