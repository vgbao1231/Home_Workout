import apiService from './apiService';

const API_AUTH_PREFIX = process.env.REACT_APP_API_AUTH_PREFIX;

export const login = async (username, password) => {
    try {
        const response = await apiService.get(`${API_AUTH_PREFIX}/authenticate.json`, {
            username,
            password,
        });
        const data = response.data;

        // Kiểm tra username và password
        if (username === 'gura1231@gmail.com' && password === '123123') {
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
        const response = await apiService.get(`${API_AUTH_PREFIX}/logout.json`);
        const data = response.data;

        // Kiểm tra username và password
        const checkLogout = true;
        return checkLogout ? data.success : data.failed;
    } catch (error) {
        console.error(error);
        throw new Error('Unexpected Error');
    }
};
