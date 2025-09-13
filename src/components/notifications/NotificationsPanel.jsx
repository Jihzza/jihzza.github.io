// src/components/notifications/NotificationsPanel.jsx
import React from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation, Trans } from 'react-i18next';

const NotificationMessage = ({ notification }) => {
  const { t } = useTranslation();

  switch (notification.type) {
    case 'new_message':
      return (
        <Trans
          i18nKey="notifications.types.newMessage"
          values={{ sender: notification.data?.sender_username }}
          components={[<span className="font-semibold text-white" />]}
        />
      );
    case 'consultation_reminder':
      return (
        <Trans
          i18nKey="notifications.types.consultationReminder"
          values={{ time: notification.data?.consultation_time }}
          components={[<span className="font-semibold text-white" />]}
        />
      );
    case 'new_consultation_booking':
      return (
        <Trans
          i18nKey="notifications.types.newConsultationBooking"
          components={[<span className="font-semibold text-white" />]}
        />
      );
    case 'user_signup':
    case 'admin_alert':
    case 'subscription_started':
    case 'subscription_expiring':
    case 'pitch_request_submitted':
    case 'pitch_request_status':
      return <span className="text-white">{notification.message || notification.title}</span>;
    default:
      return <span className="text-white">{notification.message || notification.title || t('notifications.types.default')}</span>;
  }
};

// Simple white dot indicator for notifications
const NotificationDot = () => {
  return (
    <div className="w-1 h-1 bg-b rounded-full flex-shrink-0 mt-1"></div>
  );
};

export default function NotificationsPanel({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) markAsRead(notification.id);
    if (notification.type === 'new_message' && notification.data?.conversation_id) {
      navigate(`/messages/${notification.data.conversation_id}`);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 max-w-sm bg-gray-900 rounded-lg shadow-2xl border border-gray-700 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white text-lg">{t('notifications.panel.title')}</h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead} 
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {t('notifications.panel.markAllAsRead')}
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-2 text-sm">{t('notifications.panel.loading')}</p>
          </div>
        )}
        
        {!loading && notifications.length === 0 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0 15 0v5z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">{t('notifications.panel.noNotifications')}</p>
          </div>
        )}
        
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 ${
                !n.is_read ? 'bg-gray-800/40' : 'bg-gray-900/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* White dot indicator */}
                <div className="flex-shrink-0">
                  <NotificationDot />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-100 leading-5">
                        <NotificationMessage notification={n} />
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    
                    {/* Unread indicator */}
                    {!n.is_read && (
                      <div className="flex-shrink-0 ml-2 mt-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full block" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
