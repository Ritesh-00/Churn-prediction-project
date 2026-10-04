import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const predictSingleCustomer = createAsyncThunk(
  'prediction/predictSingle',
  async ({ customerData, threshold = 0.4, saveToDb = true }, { rejectWithValue }) => {
    try {
      const response = await api.post('/predictions/single', {
        customerData,
        threshold,
        saveToDb,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const predictBatchCSV = createAsyncThunk(
  'prediction/predictBatchCSV',
  async ({ file, threshold = 0.4, saveToDb = false }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('threshold', threshold);
      formData.append('saveToDb', saveToDb);

      const response = await api.post('/predictions/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  currentPrediction: null,
  batchResults: null,
  globalThreshold: 0.4,
  isLoading: false,
  isBatchLoading: false,
  error: null,
  batchError: null,
  lastSavedCustomer: null,
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    setGlobalThreshold: (state, action) => {
      state.globalThreshold = action.payload;
    },
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
      state.lastSavedCustomer = null;
      state.error = null;
    },
    clearBatchResults: (state) => {
      state.batchResults = null;
      state.batchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Single Prediction
      .addCase(predictSingleCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(predictSingleCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrediction = action.payload.prediction;
        state.lastSavedCustomer = action.payload.customer;
      })
      .addCase(predictSingleCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to predict churn';
      })
      // Batch Prediction
      .addCase(predictBatchCSV.pending, (state) => {
        state.isBatchLoading = true;
        state.batchError = null;
      })
      .addCase(predictBatchCSV.fulfilled, (state, action) => {
        state.isBatchLoading = false;
        state.batchResults = action.payload;
      })
      .addCase(predictBatchCSV.rejected, (state, action) => {
        state.isBatchLoading = false;
        state.batchError = action.payload || 'Failed to process batch CSV';
      });
  },
});

export const { setGlobalThreshold, clearCurrentPrediction, clearBatchResults } =
  predictionSlice.actions;
export default predictionSlice.reducer;
