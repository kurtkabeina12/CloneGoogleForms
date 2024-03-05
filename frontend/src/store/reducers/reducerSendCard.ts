import { createSlice } from '@reduxjs/toolkit';
import { sendCardAsync } from '../action/actionSendForm';

const cardSlice = createSlice({
 name: 'cards',
 initialState: { cards: [], status: 'idle', error: null as string | null },
 reducers: {
    // Your existing reducers
 },
 extraReducers: (builder) => {
    builder
      .addCase(sendCardAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendCardAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cards = action.payload;
      })
      .addCase(sendCardAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
 },
});

export default cardSlice.reducer;
