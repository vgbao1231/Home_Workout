import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import toastSlice from './slices/toastSlice';
import exerciseSlice from './slices/exerciseSlice';
import userInfoSlice from './slices/userInfoSlice';
import enumSlice from './slices/enumSlice';


const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        exercise: exerciseSlice,
        userInfo: userInfoSlice,
        enum: enumSlice
    },
});

export default store;
