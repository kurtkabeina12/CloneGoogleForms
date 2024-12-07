import { createSlice } from '@reduxjs/toolkit';
import { sendTestData } from '../action/actionSendPassedTest';

const formSlice = createSlice({
 name: 'TestData',
 initialState: {
    loading: false,
    error: null as string | null,
    success: false,
 },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(sendTestData.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendTestData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendTestData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
 },
});

export default formSlice.reducer;
