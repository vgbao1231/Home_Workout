import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '~/store/authSlice';
import { addToast } from '~/store/toastSlice';

const HomePage = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.auth);
    const navigate = useNavigate();
    console.log(state);

    const handleLogout = async () => {
        dispatch(logoutThunk()).then((result) => {
            console.log(result);
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
        console.log('state: ');
        console.log(state);
    };

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default HomePage;
