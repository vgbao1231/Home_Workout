import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import toastSlice from './toastSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        toast: toastSlice,
    },
});
console.log('store: ');
console.log(store);

export default store;
