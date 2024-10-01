import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllLevels } from '~/services/exerciseService';

// Thunk get data from API
export const fetchLevelData = createAsyncThunk('level/fetchLevelData', async (_, { rejectWithValue }) => {
    try {
        const response = await getAllLevels();
        return response;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const levelSlice = createSlice({
    name: 'level',
    initialState: {
        levelData: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        // message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLevelData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLevelData.fulfilled, (state, action) => {
                state.loading = false;
                state.levelData = action.payload;
            })
            .addCase(fetchLevelData.rejected, (state, action) => {
                state.loading = false;
                // state.message = action.payload.message;
            });
    },
});

export default levelSlice.reducer;
