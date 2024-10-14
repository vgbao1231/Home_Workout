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
    reducers: {
        toggleSelectRow: (state, action) => {
            const rowId = action.payload;
            state.selectedRows[rowId] = !state.selectedRows[rowId];
        },
        selectAllRows: (state, action) => {
            console.log(action.payload);
            state.selectedRows = action.payload
                ? state.data.reduce((acc, row) => {
                    acc[row.subscriptionId] = true;
                    return acc;
                }, {})
                : {};
        },
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
                // state.data = action.payload.data.data;
                // state.totalPages = action.payload.data.totalPages;
                // state.message = action.payload.message;
                const data = {
                    data: {
                        data: [],
                        totalPages: 1
                    },
                    message: "Hello"
                };
                for (let ind = 0; ind <= 20; ind++)
                    data.data.data.push({
                        subscriptionId: ind,
                        firstName: "Dung",
                        lastName: "Le Van",
                        subscribedTime: new Date(2024, 11, 11, 11, 0, 0).toISOString(),
                        efficientDays: 60,
                        scheduleName: "Yeah Yeah Yeah",
                        scheduleLevelEnum: "BEGINNER",
                        scheduleCoins: 2000,
                        completedTime: new Date(2025, 11, 11, 11, 0, 0).toISOString()
                        // ind%2==0 ? null : 
                    });
                state.data = data.data.data;
                state.totalPages = data.data.totalPages;
                state.message = data.message;
            })
            .addCase(SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { toggleSelectRow, selectAllRows } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;