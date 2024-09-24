import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllExercises } from '~/services/exerciseService';

// Thunk get data from API
export const fetchExerciseData = createAsyncThunk('exercise/fetchExerciseData', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllExercises();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        selectedRows: {},
        exerciseData: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        // message: '',
    },
    reducers: {
        toggleSelectRow: (state, action) => {
            const rowId = action.payload;
            state.selectedRows[rowId] = !state.selectedRows[rowId];
        },
        selectAllRows: (state, action) => {
            state.selectedRows = action.payload
                ? state.exerciseData.reduce((acc, row) => {
                      acc[row.id] = true;
                      return acc;
                  }, {})
                : {};
        },
        updateRow: (state, action) => {
            const { id, ...changes } = action.payload;
            state.exerciseData = state.exerciseData.map((currentRow) => {
                return currentRow.id === id ? { ...currentRow, ...changes } : currentRow;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExerciseData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExerciseData.fulfilled, (state, action) => {
                state.loading = false;
                state.exerciseData = action.payload;
            })
            .addCase(fetchExerciseData.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, updateRow } = exerciseSlice.actions;
export default exerciseSlice.reducer;
