import AxiosHelpers from "~/utils/axiosHelpers";
import { springService } from "./apiService";

const FAST_API_ADMIN_PREFIX = process.env.REACT_APP_FAST_API_PREFIX_URL + process.env.REACT_APP_API_ADMIN_PREFIX;

export class DatalinesAdminService {
    static async getDecisionScheduleDataset(page, filterFields, sortedField, sortedMode) {
        try {
            const response = await springService.get(`${FAST_API_ADMIN_PREFIX}/v1/get-schedule-decision-dataset-pages`, {
                params: { page, filterFields, sortedField, sortedMode },
                paramsSerializer: AxiosHelpers.paramsSerializerForGet,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async addDataLine(formData) {
        try {
            const response = await springService.post(`${FAST_API_ADMIN_PREFIX}/v1/add-decision-schedule-dataline`, formData);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
    
    static async deleteDataLine(datalineId) {
        try {
            const response = await springService.delete(`${FAST_API_ADMIN_PREFIX}/v1/delete-decision-schedule-dataline`, {
                data: { dataline_id: datalineId }
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }

    static async exportCSV() {
        try {
            const response = await springService.put(`${FAST_API_ADMIN_PREFIX}/v1/export-decision-schedule-dataset-to-csv`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error.response ? error.response.data : error;
        }
    }
}