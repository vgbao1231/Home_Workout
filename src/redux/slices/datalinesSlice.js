import { createSlice } from '@reduxjs/toolkit';
import { DatalinesAdminThunk } from '../thunks/datalinesThunk';

const datalinesSlice = createSlice({
    name: 'datalines',
    initialState: {
        primaryKey: 'id',
        selectedRows: {},
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get all datalines
        builder
            .addCase(DatalinesAdminThunk.getDecisionScheduleDatasetThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(DatalinesAdminThunk.getDecisionScheduleDatasetThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(DatalinesAdminThunk.getDecisionScheduleDatasetThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default datalinesSlice.reducer;