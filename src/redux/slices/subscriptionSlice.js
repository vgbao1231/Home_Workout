import { createSlice } from '@reduxjs/toolkit';
import { SubscriptionAdminThunk } from '../thunks/subscriptionThunk';

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: {
        primaryKey: 'subscriptionId',
        selectedRows: {},
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get all subscriptions by userInfoId
        builder
            .addCase(SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk.fulfilled, (state, action) => {
                state.loading = false;
                // state.data = action.payload.data.data.map(objData => ({
                //     ...objData,
                //     dob: new Date(...objData.dob).toISOString().slice(0, 10),
                //     createdTime: new Date(...objData.createdTime).toISOString(),
                // }));
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default subscriptionSlice.reducer;