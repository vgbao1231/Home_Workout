import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '~/firebase/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    });

    async function initializeUser(user) {
        if (user) {
            setCurrentUser(user);
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        setCurrentUser,
        userLoggedIn,
        loading,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

// AuthContext using BE Authentication
// src/hooks/useAuth.js
// import { createContext, useEffect, useState } from 'react';
// import apiService from '~/services/apiService';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const response = await apiService.get('/api/private/user/v1/profile'); // Đây chỉ là api giả định để lấy user's infor
//                 setCurrentUser(response.data);
//             } catch (error) {
//                 setCurrentUser(null);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth();
//     }, []);

//     const value = {
//         currentUser,
//         loading,
//     };

//     return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
// };
