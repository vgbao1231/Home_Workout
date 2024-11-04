import { ChevronFirst, ChevronLast, LogOut } from 'lucide-react';
import { useState, Children, cloneElement, useCallback } from 'react';
import { AuthPrivateThunk } from '~/redux/thunks/authThunk';
import { addToast } from '~/redux/slices/toastSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../Sidebar.scss';

function AdminSidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            <div className="profile-container center">
                <div className="avatar center">A</div>
                <div className={`info${isExpanded ? ' expand' : ''}`}>
                    <p className="name">Bảo Võ</p>
                    <p className="email">vgbao1231@gmail.com</p>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;
