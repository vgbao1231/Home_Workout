import { createSlice } from '@reduxjs/toolkit';
import { SubscriptionAdminThunk } from '../thunks/subscriptionThunk';
import { formatResponseLocalDateTime } from '~/utils/formatters';

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
            const { page, rowData, remove } = action.payload;
            if (remove){
                delete state.selectedRows[page][rowData.exerciseId];    //--Remove row
                Object.keys(state.selectedRows[page]).length === 0 && delete state.selectedRows[page];  //--Remove page if it's empty
            } else {
                if (!(page in rowData)) state.selectedRows[page] = {};  //--Create empty page if it's not existing.
                state.selectedRows[page][rowData.exerciseId] = rowData;
            }
        },
        selectAllRows: (state, action) => {
            const { page, allRows, remove } = action.payload;
            if (remove)
                delete state.selectedRows[page];
            else {
                if (!(page in state.selectedRows)) state.selectedRows[page] = {};  //--Create empty page if it's not existing.
                state.selectedRows[page] = allRows.reduce((acc, row) => {
                    acc[row.exerciseId] = row;
                    return acc;
                }, {});
            }
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
                state.data = action.payload.data.data.map(objData => ({
                    ...objData,
                    completedTime: formatResponseLocalDateTime(objData.completedTime),
                    subscribedTime: formatResponseLocalDateTime(objData.subscribedTime),
                }));
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { toggleSelectRow, selectAllRows } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;