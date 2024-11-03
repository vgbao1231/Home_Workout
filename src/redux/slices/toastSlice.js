import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
    name: 'toast',
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
            prepare: (message, type, duration) => {
                const id = Date.now();
                return { payload: { id, message, type, duration: duration || 4000 } };
            },
        },
        removeToast: {
            reducer: (state, action) => {
                const id = action.payload.id;
                state.toasts = state.toasts.filter((toast) => toast.id !== id);
            },
            prepare: (id) => {
                return { payload: { id } };
            },
        },
    },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
