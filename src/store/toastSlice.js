import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
    name: 'auth',
    initialState: {
        toasts: [],
    },
    reducers: {
        addToast: {
            reducer: (state, action) => {
                // slice method will handle the number of toasts to be displayed
                state.toasts = [action.payload, ...state.toasts].slice(0, 1);
            },
            // prepare function(Redux Toolkit) prepare the data (payload) before it is processed in the reducer.
            prepare: (message, type) => {
                const id = Date.now();
                return { payload: { id, message, type } };
            },
        },
        removeToast: (state, action) => {
            const id = action.payload.id;
            state.toasts.filter((toast) => toast.id !== id);
        },
    },
});

console.log('slice: ');
console.log(toastSlice);

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
