import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExerciseTable } from '~/components';
import { addToast } from '~/redux/slices/toastSlice';
import { logoutThunk } from '~/redux/thunks/authThunk';
import { createSelector } from '@reduxjs/toolkit';


export default function ManageUserInfoPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(state => state.enum.loading);

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
        <div className="manage-user-info-page">
            <h1>Manage User Info</h1>
            <ExerciseTable />
        </div>
    );
};
