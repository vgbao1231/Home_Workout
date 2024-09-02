import Cookies from 'js-cookie';
import apiService from './apiService';

const API_AUTH_PREFIX = process.env.REACT_APP_API_AUTH_PREFIX;

export const login = async (username, password) => {
    try {
        const response = await apiService.get(`${API_AUTH_PREFIX}/authenticate.json`, {
            username,
            password,
        });
        const data = response.data;

        //Test
        if (username === 'gura1231@gmail.com' && password === '123123') {
            const { accessToken, refreshToken } = response.data;
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
            return data.success;
        } else {
            return data.failed;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Unexpected Error');
    }
};

export const logout = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        const response = await apiService.get(
            `${API_AUTH_PREFIX}/logout`,
            { accessToken },
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );
        const data = response.data;

        const checkLogout = true; // Test
        return checkLogout ? data.success : data.failed;
    } catch (error) {
        console.error(error);
        throw new Error('Unexpected Error');
    }
};
