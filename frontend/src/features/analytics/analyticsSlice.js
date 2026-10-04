import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardMetrics = createAsyncThunk(
  'analytics/fetchDashboardMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/overview');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const simulateThresholdImpact = createAsyncThunk(
  'analytics/simulateThresholdImpact',
  async (threshold, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/simulate-threshold', {
        params: { threshold },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    metrics: null,
    simulationResult: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch analytics metrics';
      })
      // Simulation
      .addCase(simulateThresholdImpact.fulfilled, (state, action) => {
        state.simulationResult = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
