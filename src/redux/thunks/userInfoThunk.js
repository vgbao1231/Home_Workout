import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserInfoAdminService } from '~/services/userInfoService';

export class UserInfoAdminThunk {
    static getAllUserInfoThunk = createAsyncThunk('userInfo/admin/getAllUserInfo',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
            try {
                const response = await UserInfoAdminService.getAllUserUnfo(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    )

    static updateUserStatusThunk = createAsyncThunk('userInfo/admin/updateUserStatus',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await UserInfoAdminService.updateUserStatus(formData);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    )
}

export class UserInfoUserThunk {

}