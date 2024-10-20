import { createSlice } from '@reduxjs/toolkit';
import {
    fetchExercisesOfSessionThunk,
    updateExercisesOfSessionThunk,
} from '../thunks/exercisesOfSessionThunk';

const exercisesOfSessionSlice = createSlice({
    name: 'exerciseOfSession',
    initialState: {
        primaryKey: 'exerciseId',
        selectedRows: {},
        filterData: [],
        sortData: [],
        data: [],
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
        builder
            .addCase(fetchExercisesOfSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExercisesOfSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.data.map(element => {
                    const { exercise, ...rest } = element
                    return {
                        ...rest,
                        ...exercise,
                        musclesList: exercise.muscles.map(muscle => muscle.muscleName)
                    };
                });
                state.message = action.payload.message;
            })
            .addCase(fetchExercisesOfSessionThunk.rejected, (state) => {
                state.loading = false;
            });
        builder
            .addCase(updateExercisesOfSessionThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateExercisesOfSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(updateExercisesOfSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows, setFilterData, setSortData } = exercisesOfSessionSlice.actions;
export const { ...exercisesOfSessionActions } = exercisesOfSessionSlice.actions;
export default exercisesOfSessionSlice.reducer;
