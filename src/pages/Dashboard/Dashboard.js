import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToast } from '~/redux/slices/toastSlice';
import './Dashboard.scss';
import { logoutThunk } from '~/redux/thunks/authThunk';
import { EnumAdminThunk } from '~/redux/thunks/enumThunk';
import ExerciseTable from './ExerciseTable/ExerciseTable';
import SessionTable from './SessionTable/SessionTable';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.enum.loading);

    console.log('home');

    // Handle log out
    const handleLogout = async () => {
        dispatch(logoutThunk()).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
    };

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
        <div className="dashboard">
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Log Out</button>
            <ExerciseTable />
            <SessionTable />
        </div>
    );
};

export default Dashboard;
