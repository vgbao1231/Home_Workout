import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllExcercises } from '~/services/excerciseService';

// Thunk get data from API
export const getInitialData = createAsyncThunk('excercise/getInitialData', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllExcercises();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const excerciseSlice = createSlice({
    name: 'excercise',
    initialState: {
        selectedRows: {},
        data: [],
        loading: false,
        // message: '',
    },
    reducers: {
        toggleSelectRow: (state, action) => {
            const rowId = action.payload;
            state.selectedRows[rowId] = !state.selectedRows[rowId];
        },
        selectAllRows: (state, action) => {
            state.selectedRows = action.payload
                ? state.data.reduce((acc, row) => {
                      acc[row.id] = true;
                      return acc;
                  }, {})
                : {};
        },
        updateRow: (state, action) => {
            const { id, ...changes } = action.payload;
            state.data = state.data.map((currentRow) => {
                return currentRow.id === id ? { ...currentRow, ...changes } : currentRow;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInitialData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInitialData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getInitialData.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, updateRow } = excerciseSlice.actions;
export default excerciseSlice.reducer;
