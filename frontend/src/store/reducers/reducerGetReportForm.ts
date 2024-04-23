import { createSlice } from '@reduxjs/toolkit';
import { fetchGetReportForm } from '../action/actionGetReportForm';

const getReportFormSlice = createSlice({
 name: 'GetFormReport',
 initialState: { formData: null, status: 'idle', error: null as string | null },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(fetchGetReportForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetReportForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formData = action.payload;
      })
      .addCase(fetchGetReportForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default getReportFormSlice.reducer;
