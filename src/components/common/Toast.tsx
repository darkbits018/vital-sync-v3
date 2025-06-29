import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../../types';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
};

export function Toast({ notification, onClose }: ToastProps) {
  const Icon = iconMap[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div className={`flex items-center p-4 mb-3 border rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full ${colorMap[notification.type]}`}>
      <Icon size={20} className="mr-3 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{notification.message}</p>
      <button
        onClick={() => onClose(notification.id)}
        className="ml-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export function ToastContainer({ notifications, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}