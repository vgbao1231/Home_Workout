import { useDispatch, useSelector } from "react-redux";
import SchedulesList from "./SchedulesList/SchedulesList";
import './SubscribeSchedulesPage.scss';
import { EnumUserThunk } from "~/redux/thunks/enumThunk";
import { useEffect } from "react";
import { addToast } from "~/redux/slices/toastSlice";

export default function SubscribeSchedulesPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.enum.loading);

    useEffect(() => {
        (async function fetchEnums() {
            try {
                await dispatch(EnumUserThunk.getAllLevelsEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        })();
    }, [dispatch]);

    return <div className="subscribe-schedules-page">
        <h1>Subscribe Schedules Page </h1>
        {isLoading ? <div>Locading...</div> : <SchedulesList />}
    </div>;
}