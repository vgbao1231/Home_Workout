import './ContextMenu.scss';

function ContextMenu({ contextMenu, setContextMenu }) {
    const { isShown, x, y, menuItems } = contextMenu;
    const handleClick = (item) => {
        item.action();
        setContextMenu({});
    };

    return (
        isShown && (
            <>
                <div
                    style={{
                        top: y + 'px',
                        left: x + 'px',
                    }}
                    className={`context-menu${isShown ? ' shown' : ''}`}
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
                <div className="context-overlay" onClick={() => setContextMenu({})}></div>
            </>
        )
    );
}

export default ContextMenu;
