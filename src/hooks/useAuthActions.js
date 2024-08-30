import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { login, loginWithGoogle, logout } from '~/services/authService';
import { useAuth } from './useAuth';

export const useAuthActions = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { setCurrentUser } = useAuth();

    const handleLogin = async ({ email, password }) => {
        try {
            const user = await login(email, password);
            console.log('Login successful:', user); // Kiểm tra xem login có thành công hay không
            setCurrentUser(user);
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            toast('Login failed', 'error');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await loginWithGoogle();
            setCurrentUser(user);
            navigate('/');
        } catch (error) {
            toast('Login with Google failed', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setCurrentUser(null);
            navigate('/login');
        } catch (error) {
            toast('Logout failed', 'error');
        }
    };

    return { handleLogin, handleGoogleLogin, handleLogout };
};

// import { useNavigate } from 'react-router-dom';
// import { useToast } from './useToast';
// import { login, logout } from '~/services/authService';
// import { useAuth } from './useAuth';

// export const useAuthActions = () => {
//     const navigate = useNavigate();
//     const { toast } = useToast();
//     const { setUser } = useAuth();

//     const handleLogin = async (username, password) => {
//         try {
//             const { accessToken, refreshToken } = await login(username, password);
//             setUser({ accessToken, refreshToken });
//             navigate('/');
//             toast('Login successful', 'success');
//         } catch (error) {
//             toast(error.message, 'error');
//         }
//     };

//     const handleLogout = async () => {
//         try {
//             const { accessToken, refreshToken } = useAuth(); // Lấy token từ useAuth
//             await logout(accessToken, refreshToken);
//             setUser(null);
//             navigate('/login');
//             toast('Logout successful', 'success');
//         } catch (error) {
//             toast(error.message, 'error');
//         }
//     };

//     return { handleLogin, handleLogout };
// };
