import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes, userRoutes, publicRoutes } from './routes';
import { useSelector } from 'react-redux';
import Toast from './components/ui/Toast/Toast';
import { Fragment } from 'react';
import Cookies from 'js-cookie';
import AxiosHelpers from '~/utils/axiosHelpers';

const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    USER: 'ROLE_USER',
};
export default function App() {
    const jwtClaims = AxiosHelpers.checkAndReadBase64Token(Cookies.get('accessToken'));
    const { toasts } = useSelector((state) => state.toast);
    return (
        <Router>
            <div className="App">
                <div className="toast-container">
                    {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
                </div>
                {CurrentRoutes(jwtClaims)}
            </div>
        </Router>
    );
}

function CurrentRoutes(jwtClaims) {
    const navigatedIncasePrivate = [
        index => <Route key={index} path="*" element={<Navigate to="/" />} />,      
    ];
    const navigatedIncasePublic = [
        index => <Route key={index} path="*" element={<Navigate to="/login" /> } />   //--Assume that public "/" as Home doesn't exist.
    ]
    switch(jwtClaims["scope"]) {
        case ROLES.ADMIN:
            return <Routes> {BuilderRoutes(adminRoutes, navigatedIncasePrivate)} </Routes>;
        case ROLES.USER:
            return <Routes> {BuilderRoutes(userRoutes, navigatedIncasePrivate)} </Routes>;
        default:
            return <Routes> {BuilderRoutes(publicRoutes, navigatedIncasePublic)} </Routes>;
    }
}

function BuilderRoutes(routes, navigated) {
    return [
        ...routes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout ? route.layout : Fragment;
            return <Route key={index} path={route.path} element={<Layout> <Page /> </Layout>} />;
        }),
        ...navigated.map((route, index) => route(routes.length + index))
    ];
}