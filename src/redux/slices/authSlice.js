import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, logoutThunk } from '../thunks/authThunk';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
        // Logout
        builder
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutThunk.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default authSlice.reducer;
