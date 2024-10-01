import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import toastSlice from './toastSlice';
import exerciseSlice from './exerciseSlice';
import levelSlice from './levelSlice';
import muscleSlice from './muscleSlice';

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
