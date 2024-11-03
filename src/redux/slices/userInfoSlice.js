import { createSlice } from '@reduxjs/toolkit';
import { UserInfoAdminThunk } from '../thunks/userInfoThunk';
import { formatResponseLocalDate, formatResponseLocalDateTime } from '~/utils/formatters';

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
                state.data = action.payload.data.data.map(objData => ({
                    ...objData,
                    dob: formatResponseLocalDate(objData.dob),
                    createdTime: formatResponseLocalDateTime(objData.createdTime),
                }));
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
                for (var ind = 0; ind < state.data.length; ind++) {
                    if (state.data[ind]["userId"] === action.payload.data["userId"]) {
                        state.data[ind]["active"] = action.payload.data["newStatus"];
                        break;
                    }
                }
                state.message = action.payload.message;
            })
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default userInfoSlice.reducer;