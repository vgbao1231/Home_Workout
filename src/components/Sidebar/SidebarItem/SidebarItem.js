import { useLocation } from 'react-router-dom';

function SidebarItem({ icon, text, path, isExpanded }) {
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };
    return (
        <li className={`item center${isActive(path) ? ' active' : ''}`}>
            <a href={path}>
                {icon}
                <span className={`item-text${isExpanded ? ' expand' : ''}`}>{text}</span>
            </a>
            {!isExpanded && (
                <div className="tooltip">
                    <span className="tooltip-text">{text}</span>
                </div>
            )}
        </li>
    );
}

export default SidebarItem;
