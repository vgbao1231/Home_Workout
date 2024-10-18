import { createSlice } from '@reduxjs/toolkit';
import { SlidesAdminThunk, SlidesUserThunk } from '../thunks/slidesThunk';

const slidesSlice = createSlice({
    name: 'slides',
    initialState: {
        primaryKey: 'id',
        data: [],
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get slides
        builder
            .addCase(SlidesAdminThunk.getAllSlides.pending, (state) => {
                state.loading = true;
            })
            .addCase(SlidesAdminThunk.getAllSlides.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(SlidesAdminThunk.getAllSlides.rejected, (state) => {
                state.loading = false;
            });

        // Get slides
        builder
            .addCase(SlidesUserThunk.getAllSlides.pending, (state) => {
                state.loading = true;
            })
            .addCase(SlidesUserThunk.getAllSlides.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(SlidesUserThunk.getAllSlides.rejected, (state) => {
                state.loading = false;
            });

        // Create slide
        builder
            .addCase(SlidesAdminThunk.uploadSlide.pending, (state) => {
                state.loading = true;
            })
            .addCase(SlidesAdminThunk.uploadSlide.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(SlidesAdminThunk.uploadSlide.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });

        // Delete slide
        builder
            .addCase(SlidesAdminThunk.deleteSlide.pending, (state) => {
                state.loading = true;
            })
            .addCase(SlidesAdminThunk.deleteSlide.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(SlidesAdminThunk.deleteSlide.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export default slidesSlice.reducer;