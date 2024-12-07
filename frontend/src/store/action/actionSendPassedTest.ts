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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send cards');
            }

			const data = await response.json();
			return data;
		} catch (error) {
			const err = error as Error;
			console.log(err.message)
			return thunkAPI.rejectWithValue({ error: err.message });
		}
	}
);
