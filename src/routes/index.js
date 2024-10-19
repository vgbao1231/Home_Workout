import { AdminSidebarLayout, UserSidebarLayout } from '~/layout/SidebarLayout/SidebarLayout';
import HomePage from '~/pages/HomePage/HomePage';
import UserHomePage from '~/pages/User/HomePage/UserHomePage';
import LoginPage from '~/pages/LoginPage/LoginPage';
import ManageUserInfoPage from '~/pages/Admin/ManageUserInfoPage/ManageUserInfoPage';
import ManageSlidesPage from '~/pages/Admin/ManageSlidesPage/ManageSlidesPage';
import SubscribeSchedulesPage from '~/pages/User/SubscribeSchedules/SubscribeSchedulesPage';
// import TestPage from '~/pages/TestPage/TestPage';

const publicRoutes = [
    { path: '/login', component: LoginPage },
    { path: '/register', component: LoginPage }, // Test
    { path: '/forgot-password', component: LoginPage }, // Test
];

const adminRoutes = [
    { path: '/', component: HomePage, layout: AdminSidebarLayout },
    // { path: '/test', component: TestPage }, // Test
    { path: '/homepage', component: HomePage }, // Test
    { path: '/manage-user-info', component: ManageUserInfoPage, layout: AdminSidebarLayout },
    { path: '/manage-slides', component: ManageSlidesPage, layout: AdminSidebarLayout },
];

const userRoutes = [
    { path: '/', component: UserHomePage, layout: UserSidebarLayout },
    { path: '/subscribe-schedules', component: SubscribeSchedulesPage, layout: UserSidebarLayout },
];

export { publicRoutes, adminRoutes, userRoutes };
