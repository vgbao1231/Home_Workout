import { createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduleAdminService, ScheduleUserService } from '~/services/scheduleService';
import { addToast } from '../slices/toastSlice';

export class ScheduleAdminThunk {
    static fetchScheduleThunk = createAsyncThunk(
        'schedule/fetchSchedule',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { dispatch, rejectWithValue }) => {
            try {
                const response = await ScheduleAdminService.getAllSchedules(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static createScheduleThunk = createAsyncThunk(
        'schedule/createSchedule',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await ScheduleAdminService.createSchedule(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(ScheduleAdminThunk.fetchScheduleThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static updateScheduleThunk = createAsyncThunk(
        'schedule/updateSchedule',
        async (formData, { dispatch, rejectWithValue }) => {
            try {
                const response = await ScheduleAdminService.updateSchedule(formData);
                dispatch(addToast(response.message, 'success'));
                dispatch(ScheduleAdminThunk.fetchScheduleThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );

    static deleteScheduleThunk = createAsyncThunk(
        'schedule/deleteSchedule',
        async (scheduleId, { dispatch, rejectWithValue }) => {
            try {
                const response = await ScheduleAdminService.deleteSchedule(scheduleId);
                dispatch(addToast(response.message, 'success'));
                dispatch(ScheduleAdminThunk.fetchScheduleThunk());
                return response;
            } catch (error) {
                dispatch(addToast(error.message, 'error'));
                return rejectWithValue(error);
            }
        },
    );
}

export class ScheduleUserThunk {
    static getAvailableSchedulesOfUser = createAsyncThunk('schedule/getAvailableSchedulesOfUser',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
            try {
                const response = await ScheduleUserService.getAvailableSchedulesOfUser(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    );
}
