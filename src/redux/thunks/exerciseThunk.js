import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    createExercise,
    deleteExercise,
    getAllExercises,
    updateExercise,
    uploadExerciseImage,
} from '~/services/exerciseService';

export const fetchExerciseThunk = createAsyncThunk(
    'exercise/fetchExercise',
    async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
        try {
            const response = await getAllExercises(page, filterFields, sortedField, sortedMode);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const createExerciseThunk = createAsyncThunk(
    'exercise/createExercise',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const { img, ...form } = formData;
            const { imagePublicId, ...createResponse } = await createExercise(form);
            const uploadResponse = await uploadExerciseImage(img, createResponse.data.exerciseId);
            dispatch(fetchExerciseThunk());
            return { ...createResponse, ...uploadResponse };
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateExerciseThunk = createAsyncThunk(
    'exercise/updateExercise',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateExercise(formData);
            dispatch(fetchExerciseThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteExerciseThunk = createAsyncThunk(
    'exercise/deleteExercise',
    async (exerciseId, { dispatch, rejectWithValue }) => {
        try {
            const response = await deleteExercise(exerciseId);
            dispatch(fetchExerciseThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
