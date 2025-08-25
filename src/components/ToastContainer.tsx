import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, Toast } from '../contexts/ToastContext';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseClasses = "flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform";
    
    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-50/90 dark:bg-green-900/90 border-green-200 dark:border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-50/90 dark:bg-red-900/90 border-red-200 dark:border-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-50/90 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700`;
      case 'info':
        return `${baseClasses} bg-blue-50/90 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700`;
      default:
        return `${baseClasses} bg-white/90 dark:bg-brand-navy/90 border-brand-grayMid/30 dark:border-brand-navy/50`;
    }
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5 flex-shrink-0 mt-0.5";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600 dark:text-green-400`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600 dark:text-red-400`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
      case 'info':
        return <Info className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
      default:
        return <Info className={`${iconClass} text-brand-grayText dark:text-brand-grayLight`} />;
    }
  };

  const getTextColors = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-brand-grayText dark:text-brand-grayLight';
    }
  };

  return (
    <div 
      className={`
        ${getToastStyles()} 
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
      style={{ maxWidth: '400px' }}
    >
      <div className="mr-3">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-sm ${getTextColors()}`}>
          {toast.title}
        </div>
        {toast.message && (
          <div className={`mt-1 text-sm opacity-90 ${getTextColors()}`}>
            {toast.message}
          </div>
        )}
        {toast.action && (
          <div className="mt-2">
            <button
              onClick={toast.action.onClick}
              className={`text-xs font-medium underline hover:no-underline ${getTextColors()}`}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className={`ml-3 flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${getTextColors()}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
