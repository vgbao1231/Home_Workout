import { createSlice } from '@reduxjs/toolkit';
import { EnumAdminThunk, EnumUserThunk } from '../thunks/enumThunk';

const enumSlice = createSlice({
    name: 'enum',
    initialState: {
        data: {
            genders: [],
            levels: [],
            muscles: [],
            aims: [],
        },
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get all levelsEnum
        builder
            .addCase(EnumAdminThunk.getAllLevelsEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumAdminThunk.getAllLevelsEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.levels = action.payload.data;
                state.message = action.payload.message;

            })
            .addCase(EnumAdminThunk.getAllLevelsEnumThunk.rejected, (state) => {
                state.loading = false;
            });

        // Get all musclesEnum
        builder
            .addCase(EnumAdminThunk.getAllMusclesEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumAdminThunk.getAllMusclesEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.muscles = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumAdminThunk.getAllMusclesEnumThunk.rejected, (state) => {
                state.loading = false;
            });

        // Get all gendersEnum
        builder
            .addCase(EnumAdminThunk.getAllGendersEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumAdminThunk.getAllGendersEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.genders = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumAdminThunk.getAllGendersEnumThunk.rejected, (state) => {
                state.loading = false;
            });


        // Get all levelsEnum
        builder
            .addCase(EnumUserThunk.getAllLevelsEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumUserThunk.getAllLevelsEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.levels = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumUserThunk.getAllLevelsEnumThunk.rejected, (state) => {
                state.loading = false;
            });

        // Get all musclesEnum
        builder
            .addCase(EnumUserThunk.getAllMusclesEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumUserThunk.getAllMusclesEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.muscles = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumUserThunk.getAllMusclesEnumThunk.rejected, (state) => {
                state.loading = false;
            });

        // Get all gendersEnum
        builder
            .addCase(EnumUserThunk.getAllGendersEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumUserThunk.getAllGendersEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.genders = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumUserThunk.getAllGendersEnumThunk.rejected, (state) => {
                state.loading = false;
            });

        // Get all gendersEnum
        builder
            .addCase(EnumUserThunk.getAllAimsEnumThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(EnumUserThunk.getAllAimsEnumThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data.aims = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(EnumUserThunk.getAllAimsEnumThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default enumSlice.reducer;