// src/components/notifications/NotificationsPanel.jsx

import React from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation, Trans } from 'react-i18next'; // 1. Import hooks

// This helper component is now also used by NotificationCard, so we can define it once
// in a shared location, but for now, we'll redefine it to show the translation logic clearly.
const NotificationMessage = ({ notification }) => {
    // Note: This is the same logic as in NotificationCard.jsx
    const { t } = useTranslation();
    switch (notification.type) {
        case 'new_message':
            return <Trans i18nKey="notifications.types.newMessage" values={{ sender: notification.data.sender_username }} components={[<span className="font-bold" />]} />;
        case 'consultation_reminder':
            return <Trans i18nKey="notifications.types.consultationReminder" values={{ time: notification.data.consultation_time }} components={[<span className="font-bold" />]} />;
        case 'new_consultation_booking':
             return <Trans i18nKey="notifications.types.newConsultationBooking" components={[<span className="font-bold" />]} />;
        default:
            return t('notifications.types.default');
    }
};

export default function NotificationsPanel({ isOpen, onClose }) {
    const { t } = useTranslation(); // 2. Initialize hook
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.type === 'new_message' && notification.data.conversation_id) {
            navigate(`/messages/${notification.data.conversation_id}`);
        }
        onClose();
    };

    return (
        <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b flex justify-between items-center">
                {/* 3. Use translated text */}
                <h3 className="font-semibold text-red-800">{t('notifications.panel.title')}</h3>
                {unreadCount > 0 && (
                     <button onClick={markAllAsRead} className="text-sm text-indigo-600 hover:underline">
                        {t('notifications.panel.markAllAsRead')}
                     </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {/* 4. Use translated text */}
                {loading && <p className="p-4 text-center text-gray-500">{t('notifications.panel.loading')}</p>}
                {!loading && notifications.length === 0 && (
                    <p className="p-4 text-center text-gray-500">{t('notifications.panel.noNotifications')}</p>
                )}
                <ul>
                    {notifications.map((n) => (
                        <li
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!n.is_read ? 'bg-indigo-50' : 'bg-white'}`}
                        >
                            <p className="text-sm text-gray-700">
                               <NotificationMessage notification={n} />
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}