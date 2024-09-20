import './Dialog.scss'; // Thêm style cho dialog

function Dialog({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </div>
                <div className="dialog-body">{children}</div>
                {footer && <div className="dialog-footer">{footer}</div>}
            </div>
        </div>
    );
}

export default Dialog;
