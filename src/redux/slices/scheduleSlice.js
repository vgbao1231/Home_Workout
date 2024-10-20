import { createSlice } from '@reduxjs/toolkit';
import { ScheduleAdminThunk, ScheduleUserThunk } from '../thunks/scheduleThunk';

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        primaryKey: 'scheduleId',
        selectedRows: {},
        filterData: [],
        sortData: [],
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    reducers: {
        setFilterData(state, action) {
            state.filterData = Object.fromEntries(Object.entries(action.payload).filter(([_, value]) => value.length > 0));
        },
        setSortData(state, action) {
            state.sortData = action.payload;
        },
        toggleSelectRow: (state, action) => {
            const rowId = action.payload;
            state.selectedRows[rowId] = !state.selectedRows[rowId];
        },
        selectAllRows: (state, action) => {
            state.selectedRows = action.payload
                ? state.data.reduce((acc, row) => {
                    acc[row.scheduleId] = true;
                    return acc;
                }, {})
                : {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(ScheduleUserThunk.getAvailableSchedulesOfUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(ScheduleUserThunk.getAvailableSchedulesOfUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(ScheduleUserThunk.getAvailableSchedulesOfUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Get schedule data
        builder
            .addCase(ScheduleAdminThunk.fetchScheduleThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ScheduleAdminThunk.fetchScheduleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(ScheduleAdminThunk.fetchScheduleThunk.rejected, (state) => {
                state.loading = false;
            });

        // Create schedule
        builder
            .addCase(ScheduleAdminThunk.createScheduleThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ScheduleAdminThunk.createScheduleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ScheduleAdminThunk.createScheduleThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Update schedule
        builder
            .addCase(ScheduleAdminThunk.updateScheduleThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ScheduleAdminThunk.updateScheduleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ScheduleAdminThunk.updateScheduleThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Delete schedule
        builder
            .addCase(ScheduleAdminThunk.deleteScheduleThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ScheduleAdminThunk.deleteScheduleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ScheduleAdminThunk.deleteScheduleThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, setFilterData, setSortData } = scheduleSlice.actions;
export const { ...scheduleActions } = scheduleSlice.actions;
export default scheduleSlice.reducer;
