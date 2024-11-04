import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class SessionAdminService {
    static async getAllSessions(page, filterFields, sortedField, sortedMode) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-sessions-has-muscles-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async createSession(formData) {
        try {
            const response = await springService.post(`${API_ADMIN_PREFIX}/v1/create-session`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateSession(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-session-and-muscles`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async deleteSession(sessionId) {
        try {
            console.log(sessionId);
            const response = await springService.delete(`${API_ADMIN_PREFIX}/v1/delete-session`, {
                data: { id: sessionId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getSessionsOfScheduleRelationship(scheduleId) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-sessions-of-schedule-relationship`, {
                params: { id: scheduleId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateSessionsOfScheduleRelationship(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-sessions-of-schedule`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}

export class SessionUserService {
}
