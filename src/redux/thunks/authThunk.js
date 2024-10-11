import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, register } from '~/services/authService';

// Create thunk to handle async
export const loginThunk = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
    try {
        const response = await login(formData.email, formData.password);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        return await logout();
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const registerThunk = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
    try {
        const response = await register(formData.username, formData.password);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});
