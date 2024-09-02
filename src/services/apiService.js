import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;
const API_AUTH_PREFIX = process.env.REACT_APP_API_AUTH_PREFIX;

const apiService = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Đảm bảo rằng cookies được gửi cùng với yêu cầu
});

// Interceptor for req and res
apiService.interceptors.request.use(
    (request) => {
        if (!request.headers['Authorization']) {
            const accessToken = Cookies.get('accessToken');
            if (accessToken) {
                request.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
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
        const { response, request } = error;
        if (response && response.httpStatusCode === 403 && response.applicationCode === 11003) {
            const originalRequest = request;
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Call API refresh token to get new access token
                    const accessToken = Cookies.get('accessToken');
                    const refreshToken = Cookies.get('refreshToken');
                    const res = await apiService.get(
                        `${API_AUTH_PREFIX}/refresh-token`,
                        { accessToken },
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        },
                    );

                    if (res.httpStatusCode === 200) {
                        const newAccessToken = res.data.accessToken;

                        // Update access token in cookie and orignal request
                        Cookies.set('accessToken', newAccessToken, { path: '/' });
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                        // Resend the original request with a new access token
                        return apiService(originalRequest);
                    }
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
