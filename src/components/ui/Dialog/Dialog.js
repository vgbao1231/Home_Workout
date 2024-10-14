import { createPortal } from 'react-dom';
import './Dialog.scss';
import { X } from 'lucide-react';

const Dialog = ({ dialogProps, setDialogProps }) => {
    const { isOpen, title, body } = dialogProps
    return isOpen
        ? createPortal(
            <div className="dialog" onClick={setDialogProps({ isOpen: false, title: '', content: null })}>
                <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
                    {title && (
                        <div className="dialog-header">
                            <h2>{title}</h2>
                            <X className="dialog-close" onClick={setDialogProps({ isOpen: false, title: '', content: null })} />
                        </div>
                    )}
                    <div className="dialog-body">{body}</div>
                </div>
            </div>,
            document.getElementById('root'), // Take Dialog outside the original DOM structure
        )
        : null;
};

export default Dialog;
