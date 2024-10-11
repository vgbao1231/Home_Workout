import { Link, useLocation } from 'react-router-dom';

function SidebarItem({ icon, text, path, isExpanded }) {
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };
    return (
        <li className={`item center${isActive(path) ? ' active' : ''}`}>
            <Link to={path}>
                {icon}
                <span className={`item-text${isExpanded ? ' expand' : ''}`}>{text}</span>
            </Link>
            {!isExpanded && (
                <div className="tooltip">
                    <span className="tooltip-text">{text}</span>
                </div>
            )}
        </li>
    );
}

export default SidebarItem;
