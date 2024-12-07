import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGetStubInfo = createAsyncThunk(
    'getStubInfo',
    async ({formId} : {formId:string}, thunkAPI) => {
        try {
            const response = await fetch(`http://172.20.15.13:8888/getForms/${formId}`);
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


