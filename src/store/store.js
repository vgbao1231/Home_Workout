import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import toastSlice from './toastSlice';
import excerciseSlice from './excerciseSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        excercise: excerciseSlice,
    },
});

export default store;
