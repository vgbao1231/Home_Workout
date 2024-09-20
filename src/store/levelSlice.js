import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiService from '~/services/apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
// Thunk get data from API
export const fetchLevelData = createAsyncThunk('level/fetchLevelData', async (_, { rejectWithValue }) => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/get-all-levels.json`);
        const levelData = response.data.data;
        return levelData;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.response ? error.response.data : error);
    }
});

const levelSlice = createSlice({
    name: 'level',
    initialState: {
        levelData: [],
        loading: false,
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
