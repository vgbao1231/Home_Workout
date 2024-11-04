
import { memo, useEffect, useMemo } from 'react';
import './Toast.scss';
import { removeToast } from '~/redux/slices/toastSlice';
import { useDispatch } from 'react-redux';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

function Toast({ toast }) {
    const dispatch = useDispatch();
    const toastType = useMemo(() => {
        const toastTypes = {
            success: {
                className: 'toast__success',
                icon: <CircleCheck strokeWidth={2.5} />,
                title: 'Success'
            },
            error: {
                className: 'toast__error',
                icon: <CircleAlert strokeWidth={2.5} />,
                title: 'Error'
            },
            info: {
                className: 'toast__info',
                icon: <Info strokeWidth={2.5} />,
                title: 'Info'
            }
        };

        return toastTypes[toast.type];
    }, [toast.type]);

    const toastStyle = {
        animation: `slideInLeft 0.5s ease forwards, fadeOut 1s ease ${toast.duration / 1000 - 1}s forwards`
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [toast, dispatch]);

    return (
        <div className={`toast ${toastType.className} center`} style={toastStyle}>
            <div className="toast__icon">
                {toastType.icon}
            </div>
            <div className="toast__body">
                <h3 className="toast__title">{toastType.title}</h3>
                <p className="toast__message">{toast.message}</p>
            </div>
            <div className="toast__close" onClick={() => dispatch(removeToast(toast.id))}>
                <X />
            </div>
        </div>
    );
}

export default memo(Toast);
