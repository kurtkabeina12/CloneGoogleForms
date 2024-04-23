import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGetReportForm = createAsyncThunk(
    'getReportForm',
    async ({formId} : {formId:string}, thunkAPI) => {
        try {
            const response = await fetch(`http://localhost:8888/getForms/${formId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch form');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            const err = error as Error;
            return thunkAPI.rejectWithValue({ error: err.message });
        }
    }
);


