import { createAsyncThunk } from '@reduxjs/toolkit';
import { ExerciseAdminService } from '~/services/exerciseService';

export class ExerciseAdminThunk {
    static fetchExerciseThunk = createAsyncThunk(
        'exercise/admin/fetchExercise',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
            try {
                const response = await ExerciseAdminService.getAllExercises(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    );

    static createExerciseThunk = createAsyncThunk(
        'exercise/admin/createExercise',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const { img, ...form } = formData;
                const { imagePublicId, ...createResponse } = await ExerciseAdminService.createExercise(form);
                const uploadResponse = await ExerciseAdminService.uploadExerciseImage(createResponse.data.exerciseId, img);
                dispatch(ExerciseAdminThunk.fetchExercise());
                return { ...createResponse, ...uploadResponse };
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    );

    static updateExerciseThunk = createAsyncThunk(
        'exercise/admin/updateExercise',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await ExerciseAdminService.updateExercise(formData);
                dispatch(ExerciseAdminThunk.fetchExercise());
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    );

    static deleteExerciseThunk = createAsyncThunk(
        'exercise/admin/deleteExercise',
        async (exerciseId, { dispatch, rejectWithValue }) => {
            try {
                const response = await ExerciseAdminService.deleteExercise(exerciseId);
                dispatch(ExerciseAdminThunk.fetchExercise());
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    );
}
