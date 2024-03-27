import { createSlice } from '@reduxjs/toolkit';
import { fetchGetForm } from '../action/actionGetForm';

const getformSlice = createSlice({
 name: 'GetForm',
 initialState: { formData: null, status: 'idle', error: null as string | null },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(fetchGetForm.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGetForm.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formData = action.payload;
      })
      .addCase(fetchGetForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default getformSlice.reducer;
