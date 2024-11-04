import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;
const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

export class UserInfoAdminService {
    static async getAllUserUnfo(page, filterFields, sortedField, sortedMode) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-user-info-and-status-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async updateUserStatus(formData) {
        try {
            const response = await springService.put(`${API_ADMIN_PREFIX}/v1/update-user-status`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}

export class UserInfoUserService {
    static async getUserInfo() {
        try {
            const response = await springService.get(`${API_USER_PREFIX}/v1/get-info`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async getOtpToChangePassword(formData) {
        try {
            const response = await springService.post(`${API_USER_PREFIX}/v1/get-otp-to-change-password`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async verifyChangePasswordOtp(formData) {
        try {
            const response = await springService.post(`${API_USER_PREFIX}/v1/verify-change-password-otp`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async changePassword(formData) {
        try {
            const response = await springService.post(`${API_USER_PREFIX}/v1/change-password`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
    static async updateUserInfo(formData) {
        try {
            const response = await springService.put(`${API_USER_PREFIX}/v1/update-user-info`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}