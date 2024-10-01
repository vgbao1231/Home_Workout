import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;
const API_PRIVATE_AUTH_PREFIX = process.env.REACT_APP_API_PRIVATE_AUTH_PREFIX;

const apiService = axios.create({
    baseURL: API_URL,
});

apiService.interceptors.request.use(
    (request) => {
        const accessToken = Cookies.get('accessToken');
        // Chỉ thêm các header cần thiết, không ghi đè toàn bộ headers
        if (!request.headers) {
            request.headers = {};
        }
        request.headers['Content-Type'] = 'application/json';
        if (!request.headers['Authorization']) {
            request.headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : 'none';
        }
        request.headers['ngrok-skip-browser-warning'] = true;
        return request;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response } = error;
        const originalRequest = error.config;

        if (response && response.status === 403 && response.data.body.applicationCode === 11003) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Call API refresh token to get new access token
                    const accessToken = Cookies.get('accessToken');
                    const refreshToken = Cookies.get('refreshToken');
                    const res = await apiService.post(
                        `${API_PRIVATE_AUTH_PREFIX}/v1/refresh-token`,
                        { token: accessToken },
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        },
                    );

                    const newAccessToken = res.data.data.token;

                    // Update access token in cookie and orignal request
                    Cookies.set('accessToken', newAccessToken, {
                        path: '/',
                        secure: true,
                        sameSite: 'Strict',
                    });

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Resend the original request with a new access token
                    return apiService(response.config);
                } catch (err) {
                    console.error('Failed to refresh token', err);
                    // If refresh token is invalid or has error, redirect to login page
                    // navigate('/login');
                }
            }
        }

        return Promise.reject(error);
    },
);

export default apiService;
