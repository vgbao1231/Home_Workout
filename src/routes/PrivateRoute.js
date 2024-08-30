import { Navigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';

function PrivateRoute({ children }) {
    const { userLoggedIn } = useAuth();

    return userLoggedIn ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
