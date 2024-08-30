import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiService = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Đảm bảo rằng cookies được gửi cùng với yêu cầu
});

// Thêm interceptors nếu cần
// apiClient.interceptors.request.use(
//     (config) => {
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// apiClient.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default apiService;
