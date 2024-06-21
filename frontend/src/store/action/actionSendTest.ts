import { createAsyncThunk } from '@reduxjs/toolkit';
import { SectionForTest } from '../../types/types';

export const sendCardTest = createAsyncThunk(
	'tests/saveTest',
	async ({ title, titleOverview, textForEndtest, dateEndtest, selectedColor, sections }: { title: string, titleOverview: string, textForEndtest: string, dateEndtest: string,  selectedColor:string, sections: SectionForTest[] }, thunkAPI) => {
		try {
			const response = await fetch('http://172.20.15.13:8888/tests', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ testTitle: title, testOverview: titleOverview, testEndText: textForEndtest, testEndDate: dateEndtest, testBody: sections, selectedColor: selectedColor }),
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
