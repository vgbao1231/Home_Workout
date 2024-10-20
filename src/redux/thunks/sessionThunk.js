import { createAsyncThunk } from '@reduxjs/toolkit';
import { SessionAdminService } from '~/services/sessionService';
import { addToast } from '../slices/toastSlice';

export class SessionAdminThunk {
    static fetchSessionThunk = createAsyncThunk(
        'session/fetchSession',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { dispatch, rejectWithValue }) => {
            try {
                const response = await SessionAdminService.getAllSessions(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static createSessionThunk = createAsyncThunk(
        'session/createSession',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await SessionAdminService.createSession(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(SessionAdminThunk.fetchSessionThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static updateSessionThunk = createAsyncThunk(
        'session/updateSession',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await SessionAdminService.updateSession(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(SessionAdminThunk.fetchSessionThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static deleteSessionThunk = createAsyncThunk(
        'session/deleteSession',
        async (sessionId, { dispatch, rejectWithValue }) => {
            try {
                const response = await SessionAdminService.deleteSession(sessionId);
                dispatch(addToast(response.message, 'success'));
                dispatch(SessionAdminThunk.fetchSessionThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );
}
