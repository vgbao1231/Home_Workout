import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExerciseTable, SessionTable } from '~/components';
import { addToast } from '~/redux/slices/toastSlice';
import './HomePage.scss';
import { logoutThunk } from '~/redux/thunks/authThunk';
import { fetchLevelThunk } from '~/redux/thunks/levelThunk';
import { fetchMuscleThunk } from '~/redux/thunks/muscleThunk';
import { createSelector } from '@reduxjs/toolkit';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAnySliceLoading = createSelector(
        (state) => state.level.loading,
        (state) => state.muscle.loading,
        (levelLoading, muscleLoading) => {
            return levelLoading || muscleLoading;
        },
    );
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
            try {
                await dispatch(fetchMuscleThunk()).unwrap();
                await dispatch(fetchLevelThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
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
            <SessionTable />
        </div>
    );
};

export default HomePage;
