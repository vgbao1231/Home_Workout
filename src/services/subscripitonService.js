import AxiosHelpers from '~/utils/axiosHelpers';
import { springService } from './apiService';

const API_ADMIN_PREFIX = process.env.REACT_APP_API_ADMIN_PREFIX;

export class SubscriptionAdminService {
    static async getAllSubscriptionByUserInfo(page, filterFields, sortedField, sortedMode, id) {
        try {
            const response = await springService.get(`${API_ADMIN_PREFIX}/v1/get-all-subscriptions-by-user-info-pages`, {
                params: { page, filterFields, sortedField, sortedMode, id },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    };
}

export class SubscriptionUserService {

}