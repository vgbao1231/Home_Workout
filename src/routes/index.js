import HomePage from '~/pages/HomePage/HomePage';
import LoginPage from '~/pages/LoginPage/LoginPage';
import ProfilePage from '~/pages/ProfilePage/Profile';

// Public routes
const publicRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: LoginPage }, // Test
    { path: '/forgot-password', component: LoginPage }, // Test
];
const privateRoutes = [
    { path: '/', component: HomePage },
    { path: '/profile', component: ProfilePage }, // Test
    { path: '/homepage', component: HomePage }, // Test
];
export { publicRoutes, privateRoutes };
