import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { login, logout } from '~/services/authService';

// Create thunk to handle async
export const loginThunk = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await login(username, password);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        return await logout();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: !!Cookies.get('accessToken'),
        loading: false,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutThunk.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default authSlice.reducer;
