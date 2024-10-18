import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class SlidesAdminService {
    static async getAllSlides() {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-slides-for-home`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    static async uploadSlide(formData) {
        try {
            const response = await springService.post(`${API_ADMIN_PREFIX}/v1/upload-slide`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    static async deleteSlide(formData) {
        try {
            const response = await springService.delete(`${API_ADMIN_PREFIX}/v1/delete-slide`, {
                data: formData
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}

export class SlidesUserService {
    static async getAllSlides() {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-all-slides-for-home`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}
