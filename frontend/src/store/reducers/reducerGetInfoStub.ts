import { createSlice } from '@reduxjs/toolkit';
import { fetchGetStubInfo } from '../action/actionGetInfoStub';

const getReportFormSlice = createSlice({
 name: 'GetInfoStub',
 initialState: { formData: null, status: 'idle', error: null as string | null },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(fetchGetStubInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetStubInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formData = action.payload;
      })
      .addCase(fetchGetStubInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default getReportFormSlice.reducer;
