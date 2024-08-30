import { useContext } from 'react';
import { ToastContext } from '~/context/ToastContext';

export const useToast = () => {
    const { addToast } = useContext(ToastContext);

    const toast = (message, type) => {
        addToast(message, type);
    };

    return { toast };
};
