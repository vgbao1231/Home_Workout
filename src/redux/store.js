import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import toastSlice from './slices/toastSlice';
import levelSlice from './slices/levelSlice';
import muscleSlice from './slices/muscleSlice';
import exerciseSlice from './slices/exerciseSlice';
import sessionSlice from './slices/sessionSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        level: levelSlice,
        muscle: muscleSlice,
        exercise: exerciseSlice,
        session: sessionSlice,
    },
});

export default store;
