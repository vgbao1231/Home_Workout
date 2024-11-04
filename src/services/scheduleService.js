import AxiosHelpers from "~/utils/axiosHelpers";
import { fastApiService, springService } from "./apiService";

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class ScheduleAdminService {
    static async getAllSchedules(page, filterFields, sortedField, sortedMode) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-schedules-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async createSchedule(formData) {
        try {
            const response = await springService.post(`${API_ADMIN_PREFIX}/v1/create-schedule`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateSchedule(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-schedule-and-muscles`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async deleteSchedule(scheduleId) {
        try {
            const response = await springService.delete(`${API_ADMIN_PREFIX}/v1/delete-schedule`, {
                data: { id: scheduleId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getPreviewScheduleInfo(scheduleId) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-preview-schedule`, {
                params: { id: scheduleId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getSessionsQuantityOfSchedule(id) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-sessions-quantity-of-schedule`, {
                params: { id }, paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

}

export class ScheduleUserService {
    static async getSchedulesOfUser(isCompleted) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-schedules-of-user`, {
                params: { isCompleted }
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async getAvailableSchedulesOfUser(page, filterFields, sortedField, sortedMode) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-available-schedules-of-user-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getPreviewScheduleToPerform(scheduleId) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-preview-schedule-to-perform`, {
                params: { id: scheduleId },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async updateRepRatio(formData) {
        try {
            const response = await springService.put(`${API_USER_PREFIX}/v1/update-subscribed-schedule-rep-ratio`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async decideScheduleId(formData) {
        try {
            const response = await fastApiService.post(`${API_USER_PREFIX}/v1/decide-schedule-id`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}