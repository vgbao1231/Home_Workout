import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class SubscriptionAdminService {
    static async getAllSubscriptionByUserInfo(page, filterFields, sortedField, sortedMode, id) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-subscriptions-by-user-info-pages`, {
                params: { page, filterFields, sortedField, sortedMode, id },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}

export class SubscriptionUserService {
    static async getSessionsOfSubscribedSchedule(scheduleId, ordinal) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-sessions-of-subscribed-schedule-of-user`, {
                params: { scheduleId, ordinal },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async getExercisesInSessionOfSubscribedSchedule(sessionId) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-exercises-in-session-of-subscribed-schedule-of-user`, {
                params: { id: sessionId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async getPreviewScheduleInfoForUserToSubscribe(scheduleId) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-preview-schedule-info-for-user-to-subscribe`, {
                params: { id: scheduleId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    static async subscribeSchedule(formData) {
        try {
            const response = await springService.post(`${API_USER_PREFIX}/v1/subscribe-schedule`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async subscribeScheduleWithAI(formData) {
        try {
            const response = await springService.post(`${API_USER_PREFIX}/v1/subscribe-schedule-with-AI`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}