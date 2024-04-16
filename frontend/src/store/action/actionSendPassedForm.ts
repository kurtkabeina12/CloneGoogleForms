import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendFormData = createAsyncThunk(
	'form/FormData',
	async (formData: FormData, thunkAPI) => {
		try {
			const response = await fetch('http://localhost:8888/FormData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ formData: formData }),
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
