import "./ManageScheduleDatasetPage.scss";
import "./DatasetTable/DatasetTable";
import DatasetTable from "./DatasetTable/DatasetTable";
import { addToast } from "~/redux/slices/toastSlice";
import { EnumAdminThunk } from "~/redux/thunks/enumThunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ScheduleInfo from "./ScheduleInfo/ScheduleInfo";
import ExportCSVButton from "./ExportCSVButton/ExportCSVButton";

export default function ManageScheduleDatasetPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.enum.loading);
    const [ schedule_id, set_schedule_id ] = useState(null);

    useEffect(() => {
        (async function fetchEnums() {
            try {
                await dispatch(EnumAdminThunk.getAllGendersEnumThunk()).unwrap();
                await dispatch(EnumAdminThunk.getAllLevelsEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        })();
    }, [dispatch]);

    return <div className="manage-schedule-dataset-page">
        <h1 className="title">Decision Schedule Dataset Page</h1>
        <div className="schedule-dataset-table">
            {isLoading ? <div>Loading...</div> : <DatasetTable set_schedule_id={set_schedule_id} />}
        </div>
        <div className="main-right-page">
            <ScheduleInfo schedule_id={schedule_id} />
            <ExportCSVButton />
        </div>
    </div>;
}