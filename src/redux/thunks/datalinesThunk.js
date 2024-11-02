import { createAsyncThunk } from "@reduxjs/toolkit";
import { DatalinesAdminService } from "~/services/datalinesService";

export class DatalinesAdminThunk {
    static getDecisionScheduleDatasetThunk = createAsyncThunk('datalines/admin/getDecisionScheduleDatasetThunk',
        async ({ page = 1, filterFields, sortedField, sortedMode } = {}, { rejectWithValue }) => {
            try {
                const response = await DatalinesAdminService.getDecisionScheduleDataset(page, filterFields, sortedField, sortedMode);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    )

    static addDataLineThunk = createAsyncThunk('datalines/admin/addDataLineThunk',
        async (formData, { rejectWithValue }) => {
            try {
                const response = await DatalinesAdminService.addDataLine(formData);
                return response;
            } catch (error) {
                return rejectWithValue(error);
            }
        },
    )
}