import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import toastSlice from './slices/toastSlice';
import exerciseSlice from './slices/exerciseSlice';
import levelSlice from './slices/levelSlice';
import muscleSlice from './slices/muscleSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        exercise: exerciseSlice,
        level: levelSlice,
        muscle: muscleSlice,
    },
});

export default store;
