import { createSlice } from '@reduxjs/toolkit';
import { sendFormData } from '../action/actionSendPassedForm';

const formSlice = createSlice({
 name: 'FormData',
 initialState: {
    loading: false,
    error: null as string | null,
    success: false,
 },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(sendFormData.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFormData.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
 },
});

export default formSlice.reducer;
