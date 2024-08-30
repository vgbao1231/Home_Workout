// Use BE Authenticate
// import apiService from './apiService';

// const API_AUTH_PREFIX = process.env.REACT_APP_API_AUTH_PREFIX;

// export const login = async (username, password) => {
//     try {
//         const response = await apiService.post(`${API_AUTH_PREFIX}/authenticate`, {
//             username,
//             password,
//         });
//         const { accessToken, refreshToken } = response.data.data;
//         return { accessToken, refreshToken };
//     } catch (error) {
//         if (error.response) {
//             const { applicationCode, message } = error.response.data;
//             throw new Error(`Code: ${applicationCode}, Message: ${message}`);
//         } else {
//             throw new Error('Network Error');
//         }
//     }
// };

// export const logout = async (accessToken) => {
//     try {
//         await apiService.post(`${API_AUTH_PREFIX}/logout`, {
//             accessToken,
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });
//     } catch (error) {
//         if (error.response) {
//             const { applicationCode, message } = error.response.data;
//             throw new Error(`Code: ${applicationCode}, Message: ${message}`);
//         } else {
//             throw new Error('Network Error');
//         }
//     }
// };

// Use Firebase Authenticate
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '~/firebase/firebase';

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
};

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
    } catch (error) {
        throw new Error('Login with Google failed: ' + error.message);
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error.message);
        throw error;
    }
};
