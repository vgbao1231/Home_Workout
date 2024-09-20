import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import toastSlice from './toastSlice';
import excerciseSlice from './excerciseSlice';
import levelSlice from './levelSlice';
import muscleSlice from './muscleSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        excercise: excerciseSlice,
        level: levelSlice,
        muscle: muscleSlice,
    },
});

export default store;
