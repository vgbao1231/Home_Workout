import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExerciseTable } from '~/components';
import { isAnySliceLoading } from '~/selectors/isAnySliceLoading';
import { logoutThunk } from '~/store/authSlice';
import { fetchExerciseData } from '~/store/exerciseSlice';
import { fetchLevelData } from '~/store/levelSlice';
import { fetchMuscleData } from '~/store/muscleSlice';
import { addToast } from '~/store/toastSlice';
import './HomePage.scss';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(isAnySliceLoading);

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
        const fetchData = async () => {
            await dispatch(fetchMuscleData()).unwrap();
            await dispatch(fetchLevelData()).unwrap();
            await dispatch(fetchExerciseData()).unwrap();
        };

        fetchData();
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
            <ExerciseTable />
        </div>
    );
};

export default HomePage;
