import { createSlice } from '@reduxjs/toolkit';
import { fetchLevelThunk } from '../thunks/levelThunk';

const levelSlice = createSlice({
    name: 'level',
    initialState: {
        levelData: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLevelThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLevelThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.levelData = action.payload.data.map((level) => ({
                    raw: level.raw,
                    value: level.level,
                    text: level.name,
                }));
            })
            .addCase(fetchLevelThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default levelSlice.reducer;
