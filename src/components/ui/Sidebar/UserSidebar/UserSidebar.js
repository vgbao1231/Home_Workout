import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { useState, Children, cloneElement, useCallback, useEffect } from 'react';
import { AuthPrivateThunk } from '~/redux/thunks/authThunk';
import { addToast } from '~/redux/slices/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Sidebar.scss';
import Dialog from '../../Dialog/Dialog';
import UserProfileDialog from './UserProfileDialog/UserProfileDialog';
import AxiosHelpers from '~/utils/axiosHelpers';
import { UserInfoUserService } from '~/services/userInfoService';

function UserSidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = useSelector((state) => state.auth.accessToken);
    const jwtClaims = AxiosHelpers.checkAndReadBase64Token(accessToken);
    const [userProfile, setUserProfile] = useState({})

    // Handle log out
    const handleLogout = async () => {
        dispatch(AuthPrivateThunk.logoutThunk()).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
    };

    const handleOpenProfileDialog = useCallback(() => setDialogProps({
        isOpen: true,
        title: 'User Profile',
        className: 'user-profile',
        body: <UserProfileDialog userProfile={{ ...userProfile, email: jwtClaims.sub }} />,
    }), [userProfile])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await UserInfoUserService.getUserInfo();
                setUserProfile(response.data)
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };
        fetchData()
    }, [jwtClaims.sub, dispatch])

    return (
        <aside className="sidebar">
            <div className="logo-container center">
                <div className={`logo${isExpanded ? ' expand' : ''}`}>
                    <img src="https://img.logoipsum.com/297.svg" alt="" />
                </div>
                <button className="toggle-sidebar center" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronFirst /> : <ChevronLast />}
                </button>
            </div>
            <div className="item-container">
                <ul>{Children.map(children, (child) => cloneElement(child, { isExpanded }))}</ul>
            </div>
            <div className="logout-container" onClick={handleLogout}>
                <LogOut className="logout-icon" />
                <span className={`logout${isExpanded ? ' expand' : ''}`}>Log out</span>
            </div>
            <div className="divider"></div>
            <div className="profile-container center" onClick={handleOpenProfileDialog}>
                <div className="avatar center">A</div>
                <div className={`info${isExpanded ? ' expand' : ''}`}>
                    <p className="name">{userProfile.firstName}</p>
                    <p className="email">{jwtClaims.sub}</p>
                </div>
            </div>
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </aside>
    );
}

export default UserSidebar;
