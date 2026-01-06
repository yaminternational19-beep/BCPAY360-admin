import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = (msg, dur) => addToast(msg, 'success', dur);
    const error = (msg, dur) => addToast(msg, 'error', dur);
    const warn = (msg, dur) => addToast(msg, 'warning', dur);
    const info = (msg, dur) => addToast(msg, 'info', dur);

    return (
        <ToastContext.Provider value={{ success, error, warn, info, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, onRemove }) => {
    const icons = {
        success: <CheckCircle className="toast-icon" />,
        error: <XCircle className="toast-icon" />,
        warning: <AlertCircle className="toast-icon" />,
        info: <Info className="toast-icon" />
    };

    return (
        <div className={`toast-item ${type}`}>
            {icons[type]}
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onRemove}>
                <X size={16} />
            </button>
        </div>
    );
};
