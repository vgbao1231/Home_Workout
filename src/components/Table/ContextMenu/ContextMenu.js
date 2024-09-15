import { forwardRef } from 'react';
import './ContextMenu.scss';

function ContextMenu({ menuItems, contextMenu, setContextMenu }, ref) {
    const handleClick = (item) => {
        item.onClick();
        setContextMenu({});
    };

    return (
        <>
            <div
                style={{
                    top: contextMenu.y + 'px',
                    left: contextMenu.x + 'px',
                }}
                className={`context-menu${contextMenu.isShown ? ' shown' : ''}`}
                ref={ref}
            >
                {menuItems.map((item, index) => {
                    return (
                        <button key={index} className="menu-item" onClick={() => handleClick(item)}>
                            <span>{item.icon}</span>
                            <span>{item.text}</span>
                        </button>
                    );
                })}
            </div>
            {contextMenu.isShown && <div className="context-background" onClick={() => setContextMenu({})}></div>}
        </>
    );
}

export default forwardRef(ContextMenu);
