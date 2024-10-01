import apiService from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export const getAllExercises = async (page = 1) => {
    try {
        // const response = await apiService.get(`${API_ADMIN_PREFIX}/v1/get-exercises-has-muscles-pages`, {
        //     params: { page },
        // });
        const response = await apiService.get(`${API_ADMIN_PREFIX}/v1/get-exercises-has-muscles-pages.json`);
        const data = response.data.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error.response.data.data || error;
    }
};
export const getAllMuscles = async () => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/v1/get-all-muscles.json`);
        const muscleData = response.data.data;
        return muscleData;
    } catch (error) {
        console.error(error);
        throw error.response.data.data || error;
    }
};
export const getAllLevels = async () => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/v1/get-all-levels.json`);
        const levelData = response.data.data;
        return levelData;
    } catch (error) {
        console.error(error);
        throw error.response.data.data || error;
    }
};
