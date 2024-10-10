import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllLevels } from '~/services/exerciseService';

export const fetchLevelThunk = createAsyncThunk('level/fetchLevelThunk', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllLevels();
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
