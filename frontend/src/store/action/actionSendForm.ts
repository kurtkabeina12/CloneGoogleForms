import { createAsyncThunk } from '@reduxjs/toolkit';
import { Card } from '../../types/types';

export const sendCardAsync = createAsyncThunk(
	'cards/sendCard',
	async (cards: Card[], thunkAPI) => {
		try {
			const response = await fetch('http://localhost:8888/cards', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cards),
			});

			if (!response.ok) {
				throw new Error('Failed to send cards');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			const err = error as Error; 
			return thunkAPI.rejectWithValue({ error: err.message });
		}
	}
);