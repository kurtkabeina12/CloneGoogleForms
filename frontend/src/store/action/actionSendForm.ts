import { createAsyncThunk } from '@reduxjs/toolkit';
import { Card } from '../../types/types';

export const sendCardAsync = createAsyncThunk(
	'forms/saveForm',
	async ({ cards, title }: { cards: Card[], title: string }, thunkAPI) => {
		try {
			const response = await fetch('http://localhost:8888/forms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ formHead: title, formBody: cards }),
			});

			if (!response.ok) {
				throw new Error('Failed to send cards');
			}

			const data = await response.json();
			console.log(data, 'ответ с сервера')
			return data;
		} catch (error) {
			const err = error as Error;
			return thunkAPI.rejectWithValue({ error: err.message });
		}
	}
);
