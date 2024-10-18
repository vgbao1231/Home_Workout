import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export const getAllExercisesOfSession = async (id) => {
    try {
        const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-exercises-of-session-relationship`, {
            params: { id },
            paramsSerializer: AxiosHelpers.paramsSerializerForGet,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};

export const updateExercisesOfSession = async (formData) => {
    try {
        console.log(formData);
        const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-exercises-of-session`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};