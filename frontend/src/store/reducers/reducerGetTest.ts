import { createSlice } from '@reduxjs/toolkit';
import { fetchGetTest } from '../action/actionGetTest';

const getTestSlice = createSlice({
 name: 'GetTest',
 initialState: { formData: null, status: 'idle', error: null as string | null },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(fetchGetTest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetTest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formData = action.payload;
      })
      .addCase(fetchGetTest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default getTestSlice.reducer;
