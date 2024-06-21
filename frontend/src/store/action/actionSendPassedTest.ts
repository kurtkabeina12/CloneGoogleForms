import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendTestData = createAsyncThunk(
	'test/TestData',
	async ({ testData, testId }: { testData: FormData; testId: string }, thunkAPI) => {
		try {
			const response = await fetch('http://172.20.15.13:8888/TestData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ testData: testData, testId: testId,  }),
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
