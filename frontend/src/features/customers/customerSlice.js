import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/customers', { params });
      return {
        customers: response.data,
        pagination: response.meta,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    selectedCustomer: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch customers';
      })
      // Fetch By ID
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.selectedCustomer = action.payload;
      })
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (c) => c._id !== action.payload && c.customerId !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      });
  },
});

export const { setSelectedCustomer, clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
