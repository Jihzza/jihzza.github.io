// src/components/notifications/NotificationCard.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const NotificationMessage = ({ notification }) => {
  const { t } = useTranslation();

  switch (notification.type) {
    case 'new_message':
      return (
        <Trans
          i18nKey="notifications.types.newMessage"
          values={{ sender: notification.data?.sender_username }}
          components={[<span className="font-bold" />]}
        />
      );
    case 'consultation_reminder':
      return (
        <Trans
          i18nKey="notifications.types.consultationReminder"
          values={{ time: notification.data?.consultation_time }}
          components={[<span className="font-bold" />]}
        />
      );
    case 'new_consultation_booking':
      return (
        <Trans
          i18nKey="notifications.types.newConsultationBooking"
          components={[<span className="font-bold" />]}
        />
      );
    // Explicit app types
    case 'user_signup':
    case 'admin_alert':
    case 'subscription_started':
    case 'subscription_expiring':
    case 'pitch_request_submitted':
    case 'pitch_request_status':
      return <span>{notification.message || notification.title}</span>;
    default:
      return <span>{notification.message || notification.title || t('notifications.types.default')}</span>;
  }
};

export default function NotificationCard({ notification, onMarkAsRead }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) onMarkAsRead(notification.id);
    if (notification.type === 'new_message' && notification.data?.conversation_id) {
      navigate(`/messages/${notification.data.conversation_id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-300 ${
        notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-white hover:bg-indigo-100'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <p className="text-sm text-gray-800 md:text-lg lg:text-base">
            <NotificationMessage notification={notification} />
          </p>
          <p className="text-xs text-gray-500 mt-1 md:text-base lg:text-sm">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
        {!notification.is_read && (
          <div className="flex-shrink-0 ml-4 mt-1">
            <span className="w-3 h-3 bg-indigo-600 rounded-full block" aria-label={t('notifications.unreadAriaLabel')} />
          </div>
        )}
      </div>
    </div>
  );
}
