import { ChevronFirst, ChevronLast } from 'lucide-react';
import './Sidebar.scss';
import { useState, Children, cloneElement } from 'react';

function Sidebar({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <aside className={`sidebar`}>
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

export default Sidebar;
