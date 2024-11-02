import { useDispatch, useSelector } from "react-redux";
import "./ExportCSVButton.scss";
import { useCallback } from "react";
import { addToast } from "~/redux/slices/toastSlice";
import { DatalinesAdminService } from "~/services/datalinesService";

export default function ExportCSVButton() {
    const dispatch = useDispatch();
    const handleExportCSV = useCallback(async (e) => {
        dispatch(addToast("Wait a few seconds to process data", "success"));
        await DatalinesAdminService.exportCSV()
            .then(response => {
                dispatch(addToast(response.message, "success"));
            }).catch(error => dispatch(addToast(error, "error")))
    }, []);

    return <div className="export-csv-data-from-db-btn">
        <button onClick={handleExportCSV}>Export Database To Dataset</button>
    </div>;
}