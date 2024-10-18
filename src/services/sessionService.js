import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export const getAllSessions = async (page, filterFields, sortedField, sortedMode) => {
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
};

export const createSession = async (formData) => {
    try {
        console.log(formData);
        const response = await springService.post(`${API_ADMIN_PREFIX}/v1/create-session`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const uploadSessionImage = async (img, sessionId) => {
    try {
        console.log(img);
        const formData = new FormData();
        if (img && img.length > 0) {
            const file = img[0]; // Get first file in FileList
            formData.append('sessionId', sessionId); // Append id
            formData.append('sessionImage', file); // Append file
            formData.append('fileName', file.name); // Append file name
            formData.append('fileSize', file.size); // Append file size
        }
        const response = await springService.post(`${API_ADMIN_PREFIX}/v1/upload-session-image`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const updateSession = async (formData) => {
    try {
        console.log(formData);
        const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-session-and-muscles`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const deleteSession = async (sessionId) => {
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
};

export class SessionAdminService {
}

export class SessionUserService {
    static async getSessionsOfScheduleRelationship(scheduleId) {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-sessions-of-schedule-relationship`, {
                params: { id: scheduleId },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}
