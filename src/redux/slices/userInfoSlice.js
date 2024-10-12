import { createSlice } from '@reduxjs/toolkit';
import { UserInfoAdminThunk, UserInfoUserThunk } from '../thunks/userInfoThunk';

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        primaryKey: 'userInfoId',
        selectedRows: {},
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get all userInfo
        builder
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.rejected, (state) => {
                state.loading = false;
            });

        // Update userStatus
        builder
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows } = userInfoSlice.actions;
export default userInfoSlice.reducer;
