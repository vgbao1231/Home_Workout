import SidebarLayout from '~/layout/SidebarLayout/SidebarLayout';
import HomePage from '~/pages/HomePage/HomePage';
import LoginPage from '~/pages/LoginPage/LoginPage';

// Public routes
const publicRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: LoginPage }, // Test
    { path: '/forgot-password', component: LoginPage }, // Test
];

// Private routes
const privateRoutes = [
    { path: '/', component: HomePage, layout: SidebarLayout },
    { path: '/test', component: HomePage }, // Test
    { path: '/homepage', component: HomePage }, // Test
];
export { publicRoutes, privateRoutes };
