import SidebarLayout from '~/layout/SidebarLayout/SidebarLayout';
import Dashboard from '~/pages/Dashboard/Dashboard';
import SchedulePage from '~/pages/SchedulePage/SchedulePage';
import LoginPage from '~/pages/LoginPage/LoginPage';
import ManageUserInfoPage from '~/pages/ManageUserInfoPage/ManageUserInfoPage';

// Public routes
const publicRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: LoginPage }, // Test
    { path: '/forgot-password', component: LoginPage }, // Test
];

// Private routes
const privateRoutes = [
    { path: '/admin/dashboard', component: Dashboard, layout: SidebarLayout },
    { path: '/admin/manage-user-info', component: ManageUserInfoPage, layout: SidebarLayout },
    { path: '/user/choose-schedule', component: SchedulePage, layout: SidebarLayout },
];
export { publicRoutes, privateRoutes };
