import apiService from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export const getAllExcercises = async () => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/get-all-excercises.json`);
        const data = response.data.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const getAllLevels = async () => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/get-all-levels.json`);
        const levelData = response.data.data;
        return levelData;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
export const getAllMuscles = async () => {
    try {
        const response = await apiService.get(`${API_ADMIN_PREFIX}/get-all-muscles.json`);
        const muscleData = response.data.data;
        return muscleData;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
