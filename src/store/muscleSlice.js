import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllMuscles } from '~/services/exerciseService';

// Thunk get data from API
export const fetchMuscleData = createAsyncThunk('muscle/fetchMuscleData', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllMuscles();
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const muscleSlice = createSlice({
    name: 'muscle',
    initialState: {
        muscleData: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        // message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMuscleData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMuscleData.fulfilled, (state, action) => {
                state.loading = false;
                state.muscleData = action.payload;
            })
            .addCase(fetchMuscleData.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload.message;
            });
    },
});

export default muscleSlice.reducer;
