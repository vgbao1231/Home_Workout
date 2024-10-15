import { createSlice } from '@reduxjs/toolkit';
import { createSessionThunk, deleteSessionThunk, fetchSessionThunk, updateSessionThunk } from '../thunks/sessionThunk';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        primaryKey: 'sessionId',
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
            .addCase(fetchSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(fetchSessionThunk.rejected, (state) => {
                state.loading = false;
            });

        // Create session
        builder
            .addCase(createSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(createSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Update session
        builder
            .addCase(updateSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Delete session
        builder
            .addCase(deleteSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(deleteSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows } = sessionSlice.actions;
export default sessionSlice.reducer;
