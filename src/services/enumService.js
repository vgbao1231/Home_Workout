import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class EnumAdminService {
    static async getAllLevelsEnum() {
        try {
            const res = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-levels`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getAllMusclesEnum() {
        try {
            const res = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-muscles`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getAllGendersEnum() {
        try {
            const res = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-genders`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
}

export class EnumUserService {
    static async getAllLevelsEnum() {
        try {
            const res = await springService.get(`${API_USER_PREFIX}/v1/get-all-levels`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getAllMusclesEnum() {
        try {
            const res = await springService.get(`${API_USER_PREFIX}/v1/get-all-muscles`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    
    static async getAllGendersEnum() {
        try {
            const res = await springService.get(`${API_USER_PREFIX}/v1/get-all-genders`);
            return res.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
}