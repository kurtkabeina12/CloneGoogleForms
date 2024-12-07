import { createSlice } from '@reduxjs/toolkit';
import { GetAllForms } from '../action/actionGetAllForms';

const GetAllFormsSlice = createSlice({
 name: 'GetAllForms',
 initialState: { forms: [], status: 'idle', error: null as string | null },
 reducers: {},
 extraReducers: (builder) => {
    builder
      .addCase(GetAllForms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GetAllForms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forms = action.payload;
      })
      .addCase(GetAllForms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default GetAllFormsSlice.reducer;
