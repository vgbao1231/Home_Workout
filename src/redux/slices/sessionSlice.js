import { createSlice } from '@reduxjs/toolkit';
import { SessionAdminThunk } from '../thunks/sessionThunk';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        primaryKey: 'sessionId',
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
                    acc[row.sessionId] = true;
                    return acc;
                }, {})
                : {};
        },
    },
    extraReducers: (builder) => {
        // Get session data
        builder
            .addCase(SessionAdminThunk.fetchSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(SessionAdminThunk.fetchSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.data.forEach(element => {
                    element.musclesList = element.muscles.map(muscle => muscle.muscleName)
                });
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(SessionAdminThunk.fetchSessionThunk.rejected, (state) => {
                state.loading = false;
            });

        // Create session
        builder
            .addCase(SessionAdminThunk.createSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(SessionAdminThunk.createSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(SessionAdminThunk.createSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Update session
        builder
            .addCase(SessionAdminThunk.updateSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(SessionAdminThunk.updateSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(SessionAdminThunk.updateSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Delete session
        builder
            .addCase(SessionAdminThunk.deleteSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(SessionAdminThunk.deleteSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(SessionAdminThunk.deleteSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, setFilterData, setSortData } = sessionSlice.actions;
export const { ...sessionActions } = sessionSlice.actions;
export default sessionSlice.reducer;
