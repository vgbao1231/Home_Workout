import { fastApiService } from './apiService';

const API_USER_PREFIX = process.env.REACT_APP_API_USER_PREFIX;

// export class UserAdminService {}

export class UserUserService {
    static async calBodyFatDetection(img, gender) {
        try {
            console.log(img, gender);

            const formData = new FormData();
            if (img && img.length > 0) {

                const file = img[0]; // Get first file in FileList
                formData.append('image', file); // Append file
                formData.append('gender', gender); // Append id
                formData.append('fileName', file.name); // Append file name
                formData.append('fileSize', file.size); // Append file size
            }
            const response = await fastApiService.post(`${API_USER_PREFIX}/v1/cal-body-fat-detection`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}