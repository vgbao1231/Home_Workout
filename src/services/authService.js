import Cookies from 'js-cookie';
import { springService } from './apiService';

const API_PRIVATE_AUTH_PREFIX = process.env.REACT_APP_API_PRIVATE_AUTH_PREFIX;
const API_PUBLIC_PREFIX = process.env.REACT_APP_API_PUBLIC_PREFIX;

export class AuthPrivateService {
    static async logout() {
        try {
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');
            const response = await springService.post(
                `${API_PRIVATE_AUTH_PREFIX}/v1/logout`,
                { token: accessToken },
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        } finally {
            // Luôn xóa token trong mọi trường hợp (thành công hoặc lỗi)
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        }
    };
}

export class AuthPublicService {
    static async login(email, password) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/authenticate`, {
                email,
                password,
            });
            const { accessToken, refreshToken } = response.data.data;
            Cookies.set('accessToken', accessToken, {
                path: '/',
                secure: true,
                sameSite: 'Strict',
            });
            Cookies.set('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: 'Strict',
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };

    static async getRegisterOtp(email) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/get-register-otp`, { email });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };

    static async getForgotPasswordOtp(email) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/get-forgot-password-otp`, { email });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };

    static async verifyOtp(formData) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/verify-register-otp`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };

    static async generateRandomPassword(formData) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/generate-random-password`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };

    static async register(formData) {
        try {
            const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/register-user`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}
