import { configureStore } from '@reduxjs/toolkit';
import predictionReducer from './prediction/predictionSlice';
import customerReducer from './customers/customerSlice';
import analyticsReducer from './analytics/analyticsSlice';
import healthReducer from './health/healthSlice';

export const store = configureStore({
  reducer: {
    prediction: predictionReducer,
    customers: customerReducer,
    analytics: analyticsReducer,
    health: healthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
