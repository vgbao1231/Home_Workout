import Cookies from 'js-cookie';
import apiService from './apiService';

const API_AUTH_PREFIX = process.env.REACT_APP_API_AUTH_PREFIX;

export const login = async (username, password) => {
    try {
        const response = await apiService.get(`${API_AUTH_PREFIX}/authenticate.json`, {
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

export const logout = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        const response = await apiService.get(
            `${API_AUTH_PREFIX}/logout.json`,
            { accessToken },
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );
        Cookies.remove('accessToken');
        Cookies.remove('refershToken');
        return response.data;
    } catch (error) {
        console.error(error);
        throw error.response ? error.response.data : error;
    }
};
