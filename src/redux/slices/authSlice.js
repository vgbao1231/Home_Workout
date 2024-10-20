import { createSlice } from '@reduxjs/toolkit';
import { AuthPrivateThunk, AuthPublicThunk, loginThunk, logoutThunk } from '../thunks/authThunk';

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
            .addCase(AuthPublicThunk.loginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(AuthPublicThunk.loginThunk.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(AuthPublicThunk.loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
        // Logout
        builder
            .addCase(AuthPrivateThunk.logoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(AuthPrivateThunk.logoutThunk.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.loading = false;
            })
            .addCase(AuthPrivateThunk.logoutThunk.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default authSlice.reducer;
