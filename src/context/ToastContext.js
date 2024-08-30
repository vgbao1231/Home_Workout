import { createContext, useCallback, useState } from 'react';
import Toast from '~/components/Toast/Toast';

const ToastContext = createContext();
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type) => {
        const newToast = {
            id: Date.now(),
            message,
            type,
        };
        setToasts((prevToasts) => {
            const updatedToasts = [newToast, ...prevToasts];
            return updatedToasts.slice(0, 1); // Giữ lại tối đa 1 toast mới nhất
        });
    };

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div
                className="toast-container"
                style={{
                    position: 'fixed',
                    top: '80px',
                    right: '40px',
                    zIndex: 1,
                }}
            >
                {toasts.map((toast) => {
                    return <Toast key={toast.id} toast={toast} close={removeToast} />;
                })}
            </div>
            {children}
        </ToastContext.Provider>
    );
}

export { ToastProvider, ToastContext };
