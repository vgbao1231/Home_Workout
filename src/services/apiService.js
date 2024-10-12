import axios from 'axios';
import Cookies from 'js-cookie';

const API_PRIVATE_AUTH_PREFIX = process.env.REACT_APP_API_PRIVATE_AUTH_PREFIX;

const springService = axios.create({ baseURL: process.env.REACT_APP_SPRING_PREFIX_URL });
const fastApiService = axios.create({ baseURL: process.env.REACT_APP_FAST_API_PREFIX_URL });

const headerConfig = (more) => ({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': true,
    ...more,
});
const interceptorHander = (request) => {
    request.headers = headerConfig(request.headers);
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (request.url.toUpperCase().includes('AUTH'))
        request.headers['Authorization'] = refreshToken ? `Bearer ${refreshToken}` : 'none';
    else if (request.url.toUpperCase().includes('PRIVATE'))
        request.headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : 'none';

    return request;
};
const unawareErrorHandler = () => {
    Cookies.delete('accessToken');
    Cookies.delete('refreshToken');
    document.location.href = '/';
};
const refreshTokenHandler = async (error) => {
    const { response } = error;
    const originalRequest = error.config;
    console.log(response);

    if (response && response.status === 403 && response.data.body.applicationCode === 11003) {
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call API refresh token to get new access token
                const res = await springService.post(
                    `${API_PRIVATE_AUTH_PREFIX}/v1/refresh-token`,
                    // Automatically set-up headers by interceptor
                    { token: Cookies.get('accessToken') },
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
                return springService(response.config);
            } catch (err) {
                // Weird Exc by ReactJS
                unawareErrorHandler();
            }
        } else {
            // Error code doesn't belong to "EXPIRED_ACC_TOKEN"
            unawareErrorHandler();
        }
    }

    return Promise.reject(error);
};

springService.interceptors.request.use(interceptorHander, (error) => Promise.reject(error));
fastApiService.interceptors.request.use(interceptorHander, (error) => Promise.reject(error));
springService.interceptors.response.use((response) => response, refreshTokenHandler);
fastApiService.interceptors.response.use((response) => response, refreshTokenHandler);

export { springService, fastApiService };
