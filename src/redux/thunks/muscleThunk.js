import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMuscles } from '~/services/exerciseService';

// Thunk get data from API
export const fetchMuscleThunk = createAsyncThunk('muscle/fetchMuscleThunk', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllMuscles();
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
