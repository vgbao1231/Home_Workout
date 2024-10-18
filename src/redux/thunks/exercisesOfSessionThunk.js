import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllExercisesOfSession, updateExercisesOfSession } from '~/services/exercisesOfSessionService';

export const fetchExercisesOfSessionThunk = createAsyncThunk(
    'exercise/fetchExercisesOfSession',
    async ({ id, page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
        try {
            const response = await getAllExercisesOfSession(id, page, filterFields, sortedField, sortedMode);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateExercisesOfSessionThunk = createAsyncThunk(
    'exercise/updateExercisesOfSession',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateExercisesOfSession(formData);
            dispatch(fetchExercisesOfSessionThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

