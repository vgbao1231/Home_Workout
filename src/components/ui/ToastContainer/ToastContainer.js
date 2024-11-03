import { useSelector } from "react-redux";
import Toast from "./Toast/Toast";
import { memo } from "react";

function ToastContainer() {
    const { toasts } = useSelector((state) => state.toast);

    return (
        <div className="toast-container">
            {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
        </div>
    );
}

export default memo(ToastContainer);