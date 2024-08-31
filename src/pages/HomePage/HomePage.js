import Cookies from 'js-cookie';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import { useToast } from '~/hooks/useToast';
import { logout } from '~/services/authService';

const HomePage = () => {
    const { setIsAuthenticated } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response.httpStatusCode === 200) {
                Cookies.remove('accessToken');
                Cookies.remove('refershToken');
                setIsAuthenticated(!!Cookies.get('accessToken'));
                navigate('/login');
                toast(response.message, 'success');
            } else {
                toast(response.message, 'error');
            }
        } catch (error) {
            toast(error.message, 'error');
        }
    };

    return (
        <div>
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default HomePage;
