import { createAsyncThunk } from '@reduxjs/toolkit';
import { SubscriptionAdminService } from '~/services/subscripitonService';

export class SubscriptionAdminThunk {
    static getAllSubscriptionByUserInfoThunk = createAsyncThunk('subscription/admin/getAllSubscriptionByUserInfo',
        async ({ page = 1, filterFields, sortedField, sortedMode, id } = {}, { rejectWithValue }) => {
            try {
                const response = await SubscriptionAdminService
                    .getAllSubscriptionByUserInfo(page, filterFields, sortedField, sortedMode, id);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    )
}

export class SubscriptionUserThunk {

}