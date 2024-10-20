import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthPrivateService, AuthPublicService } from '~/services/authService';


export class AuthPrivateThunk {
    static logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
        try {
            return await AuthPrivateService.logout();
        } catch (error) {
            return rejectWithValue(error);
        }
    });
}

export class AuthPublicThunk {
    static loginThunk = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
        try {
            const response = await AuthPublicService.login(formData.email, formData.password);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    });
    static registerThunk = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
        try {
            const response = await AuthPublicService.register(formData.username, formData.password);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    });
}
