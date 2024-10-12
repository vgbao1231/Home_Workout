import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export const getAllExercises = async (page, filterFields, sortedField, sortedMode) => {
    try {
        const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-exercises-has-muscles-pages`, {
            params: { page, filterFields, sortedField, sortedMode },
            paramsSerializer: AxiosHelpers.paramsSerializerForGet,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const getAllMuscles = async () => {
    try {
        const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-muscles`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const getAllLevels = async () => {
    try {
        const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-levels`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const createExercise = async (formData) => {
    try {
        console.log(formData);
        const response = await springService.post(`${API_ADMIN_PREFIX}/v1/create-exercise`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const uploadExerciseImage = async (img, exerciseId) => {
    try {
        console.log(img);
        const formData = new FormData();
        if (img && img.length > 0) {
            const file = img[0]; // Get first file in FileList
            formData.append('exerciseId', exerciseId); // Append id
            formData.append('exerciseImage', file); // Append file
            formData.append('fileName', file.name); // Append file name
            formData.append('fileSize', file.size); // Append file size
        }
        const response = await springService.post(`${API_ADMIN_PREFIX}/v1/upload-exercise-image`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const updateExercise = async (formData) => {
    try {
        console.log(formData);
        const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-exercise-and-muscles`, formData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const deleteExercise = async (exerciseId) => {
    try {
        console.log(exerciseId);
        const response = await springService.delete(`${API_ADMIN_PREFIX}/v1/delete-exercise`, {
            data: { id: exerciseId },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
