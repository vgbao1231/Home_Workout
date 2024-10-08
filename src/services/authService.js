import Cookies from 'js-cookie';
import { springService } from './apiService';

const API_PRIVATE_AUTH_PREFIX = process.env.REACT_APP_API_PRIVATE_AUTH_PREFIX;
const API_PUBLIC_PREFIX = process.env.REACT_APP_API_PUBLIC_PREFIX;

export const login = async (email, password) => {
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

export const logout = async () => {
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

export const register = async (username, password) => {
    try {
        const response = await springService.post(`${API_PUBLIC_PREFIX}/auth/v1/register`, {
            username,
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
