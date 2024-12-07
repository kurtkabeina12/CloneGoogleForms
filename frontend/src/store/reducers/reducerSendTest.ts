import { createSlice } from '@reduxjs/toolkit';
import { sendCardTest } from '../action/actionSendTest';

const testsCardlice = createSlice({
  name: 'tests',
  initialState: { cards: [], status: 'idle', error: null as string | null },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCardTest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendCardTest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cards = action.payload;
      })
      .addCase(sendCardTest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
  },
});

export default testsCardlice.reducer;
