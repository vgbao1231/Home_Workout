import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import toastSlice from './slices/toastSlice';
import exerciseSlice from './slices/exerciseSlice';
import exercisesOfSessionSlice from './slices/exercisesOfSessionSlice';
import sessionSlice from './slices/sessionSlice';
import userInfoSlice from './slices/userInfoSlice';
import enumSlice from './slices/enumSlice';
import subscriptionSlice from './slices/subscriptionSlice';


const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
        exercise: exerciseSlice,
        exercisesOfSession: exercisesOfSessionSlice,
        session: sessionSlice,
        userInfo: userInfoSlice,
        enum: enumSlice,
        subscription: subscriptionSlice,
    },
});

export default store;
