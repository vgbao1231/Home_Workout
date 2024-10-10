import { createSlice } from '@reduxjs/toolkit';
import { fetchMuscleThunk } from '../thunks/muscleThunk';

const muscleSlice = createSlice({
    name: 'muscle',
    initialState: {
        muscleData: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMuscleThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMuscleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.muscleData = action.payload.data.map((muscle) => ({
                    raw: muscle.raw,
                    value: muscle.id,
                    text: muscle.name,
                }));
            })
            .addCase(fetchMuscleThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default muscleSlice.reducer;
