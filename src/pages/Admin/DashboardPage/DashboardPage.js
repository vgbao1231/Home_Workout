import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import './DashboardPage.scss';
import { EnumAdminThunk } from '~/redux/thunks/enumThunk';
import ExerciseTable from './ExerciseTable/ExerciseTable';
import SessionTable from './SessionTable/SessionTable';
import ScheduleTable from './ScheduleTable/ScheduleTable';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.enum.loading);

    useEffect(() => {
        (async function fetchEnums() {
            try {
                await dispatch(EnumAdminThunk.getAllLevelsEnumThunk()).unwrap();
                await dispatch(EnumAdminThunk.getAllMusclesEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        })();
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="dashboard-page">
            <span className='title center'>Dashboard</span>
            <ExerciseTable />
            <SessionTable />
            <ScheduleTable />
        </div>
    );
};

export default DashboardPage;
