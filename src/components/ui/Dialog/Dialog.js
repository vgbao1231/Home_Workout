import { createPortal } from 'react-dom';
import './Dialog.scss';
import { X } from 'lucide-react';
import { cloneElement, useCallback } from 'react';

const Dialog = ({ dialogProps, setDialogProps }) => {
    const { isOpen, title, body, className = '' } = dialogProps
    const handleClose = useCallback(() => {
        setDialogProps({ isOpen: false, title: '', content: null })
    }, [setDialogProps])
    return isOpen
        ? createPortal(
            <div className={`dialog ${className}`} onClick={handleClose}>
                <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
                    {title && (
                        <div className="dialog-header">
                            <h2>{title}</h2>
                            <X className="dialog-close" onClick={handleClose} />
                        </div>
                    )}
                    <div className="dialog-body">{cloneElement(body, { onClose: handleClose })}</div>
                </div>
            </div>,
            document.getElementById('root'), // Take Dialog outside the original DOM structure
        )
        : null;
};

export default Dialog;
