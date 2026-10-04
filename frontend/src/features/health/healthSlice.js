import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const checkSystemHealth = createAsyncThunk(
  'health/checkSystemHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState: {
    systemHealth: null,
    isChecking: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkSystemHealth.pending, (state) => {
        state.isChecking = true;
      })
      .addCase(checkSystemHealth.fulfilled, (state, action) => {
        state.isChecking = false;
        state.systemHealth = action.payload;
        state.error = null;
      })
      .addCase(checkSystemHealth.rejected, (state, action) => {
        state.isChecking = false;
        state.error = action.payload;
        state.systemHealth = {
          server: { status: 'offline' },
          database: { isConnected: false },
          mlMicroservice: { isAvailable: false },
        };
      });
  },
});

export default healthSlice.reducer;
