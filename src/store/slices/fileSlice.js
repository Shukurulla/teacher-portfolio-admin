import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNewFiles,
  getAllFiles,
  getFileById,
  updateFileStatus,
  getFilePreview,
  deleteFile,
} from "../../services/fileService";

// Async thunks
export const fetchNewFiles = createAsyncThunk(
  "files/fetchNew",
  async (_, { rejectWithValue }) => {
    try {
      return await getNewFiles();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Yangi fayllarni olishda xatolik"
      );
    }
  }
);

export const fetchAllFiles = createAsyncThunk(
  "files/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllFiles();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fayllar ro'yxatini olishda xatolik"
      );
    }
  }
);

export const fetchFileById = createAsyncThunk(
  "files/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getFileById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fayl ma'lumotlarini olishda xatolik"
      );
    }
  }
);

export const updateFile = createAsyncThunk(
  "files/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateFileStatus(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fayl holatini yangilashda xatolik"
      );
    }
  }
);

export const fetchFilePreview = createAsyncThunk(
  "files/fetchPreview",
  async (id, { rejectWithValue }) => {
    try {
      return await getFilePreview(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Fayl ko'rish ma'lumotlarini olishda xatolik"
      );
    }
  }
);

export const removeFile = createAsyncThunk(
  "files/remove",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFile(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Faylni o'chirishda xatolik"
      );
    }
  }
);

// Initial state
const initialState = {
  files: [],
  newFiles: [],
  currentFile: null,
  filePreview: null,
  loading: false,
  error: null,
};

// Slice
const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearFileError: (state) => {
      state.error = null;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
      state.filePreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch new files
      .addCase(fetchNewFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.newFiles = action.payload;
      })
      .addCase(fetchNewFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all files
      .addCase(fetchAllFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchAllFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch file by ID
      .addCase(fetchFileById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update file
      .addCase(updateFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;

        // Update in files list
        const index = state.files.findIndex(
          (file) => file._id === action.payload._id
        );
        if (index !== -1) {
          state.files[index] = action.payload;
        }

        // Remove from new files if status changed
        if (action.payload.status !== "Tekshirilmoqda") {
          state.newFiles = state.newFiles.filter(
            (file) => file._id !== action.payload._id
          );
        }
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch file preview
      .addCase(fetchFilePreview.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilePreview.fulfilled, (state, action) => {
        state.loading = false;
        state.filePreview = action.payload;
      })
      .addCase(fetchFilePreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove file
      .addCase(removeFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter((file) => file._id !== action.payload);
        state.newFiles = state.newFiles.filter(
          (file) => file._id !== action.payload
        );
        if (state.currentFile && state.currentFile._id === action.payload) {
          state.currentFile = null;
        }
      })
      .addCase(removeFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFileError, clearCurrentFile } = fileSlice.actions;
export default fileSlice.reducer;
