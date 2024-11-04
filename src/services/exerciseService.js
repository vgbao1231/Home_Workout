import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export class ExerciseAdminService {
    static async getAllExercises(page, filterFields, sortedField, sortedMode) {
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
    }

    static async createExercise(formData) {
        try {
            const response = await springService.post(`${API_ADMIN_PREFIX}/v1/create-exercise`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async uploadExerciseImage(exerciseId, img) {
        try {
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
    }

    static async updateExercise(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-exercise-and-muscles`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async deleteExercise(exerciseId) {
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
    }

    static async getExercisesOfSessionRelationship(id) {
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
    }

    static async updateExercisesOfSessionRelationship(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-exercises-of-session`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}
