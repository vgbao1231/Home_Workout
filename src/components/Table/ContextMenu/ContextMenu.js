import './ContextMenu.scss';

function ContextMenu({ contextMenuItems, contextMenu, setContextMenu }) {
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
            >
                {contextMenuItems.map((item, index) => {
                    return (
                        <button key={index} className="menu-item" onClick={() => handleClick(item)}>
                            <span>{item.icon}</span>
                            <span>{item.text}</span>
                        </button>
                    );
                })}
            </div>
            {contextMenu.isShown && <div className="context-overlay" onClick={() => setContextMenu({})}></div>}
        </>
    );
}

export default ContextMenu;
