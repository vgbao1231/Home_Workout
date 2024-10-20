import { createSlice } from '@reduxjs/toolkit';
import { ExerciseAdminThunk } from '../thunks/exerciseThunk';

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        primaryKey: 'exerciseId',
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
                    acc[row.exerciseId] = true;
                    return acc;
                }, {})
                : {};
        },
    },
    extraReducers: (builder) => {
        // Get exercise data
        builder
            .addCase(ExerciseAdminThunk.fetchExerciseThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ExerciseAdminThunk.fetchExerciseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data;
                state.data.forEach(element => {
                    element.musclesList = element.muscles.map(muscle => muscle.muscleName)
                });

                state.totalPages = action.payload.data.totalPages;
                state.message = action.payload.message;
            })
            .addCase(ExerciseAdminThunk.fetchExerciseThunk.rejected, (state) => {
                state.loading = false;
            });

        // Create exercise
        builder
            .addCase(ExerciseAdminThunk.createExerciseThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ExerciseAdminThunk.createExerciseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ExerciseAdminThunk.createExerciseThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Update exercise
        builder
            .addCase(ExerciseAdminThunk.updateExerciseThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ExerciseAdminThunk.updateExerciseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ExerciseAdminThunk.updateExerciseThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Delete exercise
        builder
            .addCase(ExerciseAdminThunk.deleteExerciseThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(ExerciseAdminThunk.deleteExerciseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(ExerciseAdminThunk.deleteExerciseThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, setFilterData, setSortData } = exerciseSlice.actions;
export const { ...exerciseActions } = exerciseSlice.actions;
export default exerciseSlice.reducer;
