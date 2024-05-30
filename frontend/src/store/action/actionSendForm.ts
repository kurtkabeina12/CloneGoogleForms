import { createAsyncThunk } from '@reduxjs/toolkit';
import { Section } from '../../types/types';

export const sendCardAsync = createAsyncThunk(
	'forms/saveForm',
	async ({ title, titleOverview, textForEndForm, dateEndForm, isMandatoryAuth, selectedColor, sections }: { title: string, titleOverview: string, textForEndForm: string, dateEndForm: string, isMandatoryAuth: boolean, selectedColor:string, sections: Section[] }, thunkAPI) => {
		try {
			const response = await fetch('http://172.20.15.13:8888/forms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ formTitle: title, formOverview: titleOverview, formEndText: textForEndForm, formEndDate: dateEndForm, formBody: sections, isMandatoryAuth: isMandatoryAuth, selectedColor: selectedColor }),
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
