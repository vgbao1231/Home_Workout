import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
    name: 'table',
    initialState: {
        updatingRow: null,
    },
    reducers: {
        setUpdatingRow: (state, action) => {
            state.updatingRow = action.payload; // Row id
        },
    },
});

export const { setUpdatingRow } = tableSlice.actions;
export default tableSlice.reducer;
