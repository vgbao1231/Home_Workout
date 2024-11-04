import { createAsyncThunk } from '@reduxjs/toolkit';
import { EnumAdminService, EnumUserService } from '~/services/enumService';

export class EnumAdminThunk {
    static getAllLevelsEnumThunk = createAsyncThunk('enums/admin/getAllLevelsEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumAdminService.getAllLevelsEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )

    static getAllMusclesEnumThunk = createAsyncThunk('enums/admin/getAllMusclesEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumAdminService.getAllMusclesEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )

    static getAllGendersEnumThunk = createAsyncThunk('enums/admin/getAllGendersEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumAdminService.getAllGendersEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )
}

export class EnumUserThunk {
    static getAllLevelsEnumThunk = createAsyncThunk('enums/user/getAllLevelsEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumUserService.getAllLevelsEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )

    static getAllMusclesEnumThunk = createAsyncThunk('enums/user/getAllMusclesEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumUserService.getAllMusclesEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )

    static getAllGendersEnumThunk = createAsyncThunk('enums/user/getAllGendersEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumUserService.getAllGendersEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )
    static getAllAimsEnumThunk = createAsyncThunk('enums/user/getAllAimsEnum',
        async (_, { rejectWithValue }) => {
            try {
                return await EnumUserService.getAllAimsEnum();
            } catch (err) {
                return rejectWithValue(err);
            }
        }
    )
}