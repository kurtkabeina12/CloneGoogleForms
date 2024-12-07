import { createAsyncThunk } from "@reduxjs/toolkit";

export const GetAllForms = createAsyncThunk(
    'getForms',
    async () => {
        try {
            const response = await fetch('http://172.20.15.13:8888/getForms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch form');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            const err = error as Error;
            return ({ error: err.message });
        }
    }
)