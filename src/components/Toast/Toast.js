import { faCircleCheck, faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useEffect } from 'react';
import './Toast.scss';
import { removeToast } from '~/store/toastSlice';
import { useDispatch } from 'react-redux';

function Toast({ toast }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast.id, dispatch]);
    return (
        <div className={`toast ${toast.type === 'success' ? 'toast__success' : 'toast__error'} center`}>
            <div className="toast__icon">
                {toast.type === 'success' ? (
                    <FontAwesomeIcon icon={faCircleCheck} />
                ) : (
                    <FontAwesomeIcon icon={faCircleExclamation} />
                )}
            </div>
            <div className="toast__body">
                <h3 className="toast__title">{toast.type === 'success' ? 'Thành công' : 'Thất bại'}</h3>
                <p className="toast__message">{toast.message}</p>
            </div>
            <div className="toast__close">
                <FontAwesomeIcon icon={faXmark} onClick={() => dispatch(removeToast(toast.id))} />
            </div>
        </div>
    );
}

export default memo(Toast);
