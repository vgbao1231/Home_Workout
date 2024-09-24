import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import toastSlice from './toastSlice';
import exerciseSlice from './exerciseSlice';
import levelSlice from './levelSlice';
import muscleSlice from './muscleSlice';
import tableSlice from './tableSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        exercise: exerciseSlice,
        level: levelSlice,
        muscle: muscleSlice,
        table: tableSlice,
    },
});

export default store;
