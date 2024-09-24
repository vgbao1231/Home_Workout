import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiService from '~/services/apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
// Thunk get data from API
export const fetchMuscleData = createAsyncThunk('muscle/fetchMuscleData', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/get-all-muscles.json`);
        const muscleData = response.data.data;
        return muscleData;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.response ? error.response.data : error);
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
