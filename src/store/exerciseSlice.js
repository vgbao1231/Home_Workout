import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllExercises } from '~/services/exerciseService';

// Thunk get data from API
export const fetchExerciseData = createAsyncThunk('exercise/fetchExerciseData', async (page, { rejectWithValue }) => {
    try {
        const response = await getAllExercises(page);
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        primaryKey: 'exerciseId',
        selectedRows: {},
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
    },
    reducers: {
        toggleSelectRow: (state, action) => {
            const rowId = action.payload;
            state.selectedRows[rowId] = !state.selectedRows[rowId];
        },
        selectAllRows: (state, action) => {
            state.selectedRows = action.payload
                ? state.data.reduce((acc, row) => {
                      acc[row.exerciseId] = true;
                      return acc;
                  }, {})
                : {};
        },
        updateRow: (state, action) => {
            const { exerciseId, ...changes } = action.payload;
            state.data = state.data.map((currentRow) => {
                return currentRow.exerciseId === exerciseId ? { ...currentRow, ...changes } : currentRow;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExerciseData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExerciseData.fulfilled, (state, action) => {
                // state.loading = false;
                // state.data = action.payload.data;
                // state.totalPages = action.payload.totalPages;
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchExerciseData.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { toggleSelectRow, selectAllRows, updateRow } = exerciseSlice.actions;
export default exerciseSlice.reducer;
