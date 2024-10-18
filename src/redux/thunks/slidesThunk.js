import { createAsyncThunk } from '@reduxjs/toolkit';
import { SlidesAdminService, SlidesUserService } from '~/services/slidesService';
import { addToast } from '../slices/toastSlice';

export class SlidesAdminThunk {
    static getAllSlides = createAsyncThunk('slides/admin/getAllSlides',
        async (_, { dispatch, rejectWithValue }) => {
            try {
                const response = await SlidesAdminService.getAllSlides();
                return response;
            } catch (response) {
                dispatch(addToast(response.message, 'error'));
                return rejectWithValue(response);
            }
        },
    )
    static uploadSlide = createAsyncThunk('slides/admin/uploadSlide',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await SlidesAdminService.uploadSlide(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(SlidesAdminThunk.getAllSlides());
                return response;
            } catch (response) {
                dispatch(addToast(response.message, 'error'));
                return rejectWithValue(response);
            }
        },
    )
    static deleteSlide = createAsyncThunk('slides/admin/deleteSlide',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await SlidesAdminService.deleteSlide(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(SlidesAdminThunk.getAllSlides());
                return response;
            } catch (response) {
                dispatch(addToast(response.message, 'error'));
                return rejectWithValue(response);
            }
        },
    )
}

export class SlidesUserThunk {
    static getAllSlides = createAsyncThunk('slides/user/getAllSlides',
        async (_, { dispatch, rejectWithValue }) => {
            try {
                const response = await SlidesUserService.getAllSlides();
                return response;
            } catch (response) {
                dispatch(addToast(response.message, 'error'));
                return rejectWithValue(response);
            }
        },
    )
}