import { createSlice } from '@reduxjs/toolkit';
import { fetchGetStubInfoTest } from '../action/actionGetInfoStubTest';

const getReportFormSlice = createSlice({
  name: 'GetInfoStubTest',
  initialState: { formData: null, status: 'idle', error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetStubInfoTest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetStubInfoTest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formData = action.payload;
      })
      .addCase(fetchGetStubInfoTest.rejected, (state, action) => {
        if (action.error.message === 'User already exists') {
          state.status = 'conflict';
          state.error = action.error.message;
        } else {
          state.status = 'failed';
          state.error = action.error.message as string;
        }
      });

  },
});

export default getReportFormSlice.reducer;
