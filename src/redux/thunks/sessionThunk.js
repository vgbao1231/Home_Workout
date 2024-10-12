import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllSessions } from '~/services/adminService';
import { createSession, deleteSession, updateSession, uploadSessionImage } from '~/services/sessionService';

export const fetchSessionThunk = createAsyncThunk(
    'session/fetchSession',
    async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
        try {
            const response = await getAllSessions(page, filterFields, sortedField, sortedMode);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const createSessionThunk = createAsyncThunk(
    'session/createSession',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const { img, ...form } = formData;
            const { imagePublicId, ...createResponse } = await createSession(form);
            const uploadResponse = await uploadSessionImage(img, createResponse.data.sessionId);
            dispatch(fetchSessionThunk());
            return { ...createResponse, ...uploadResponse };
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateSessionThunk = createAsyncThunk(
    'session/updateSession',
    async (formData, { dispatch, rejectWithValue }) => {
        try {
            const response = await updateSession(formData);
            dispatch(fetchSessionThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteSessionThunk = createAsyncThunk(
    'session/deleteSession',
    async (sessionId, { dispatch, rejectWithValue }) => {
        try {
            const response = await deleteSession(sessionId);
            dispatch(fetchSessionThunk());
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
