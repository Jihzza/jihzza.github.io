// src/components/notifications/NotificationCard.jsx

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next'; // 1. Import useTranslation and Trans

const NotificationMessage = ({ notification }) => {
    const { t } = useTranslation(); // 2. Initialize hook inside the helper

    switch (notification.type) {
        case 'new_message':
            // 3. Use the Trans component for dynamic and styled text
            return (
                <Trans
                    i18nKey="notifications.types.newMessage"
                    values={{ sender: notification.data.sender_username }}
                    components={[<span className="font-bold" />]}
                />
            );
        case 'consultation_reminder':
            return (
                <Trans
                    i18nKey="notifications.types.consultationReminder"
                    values={{ time: notification.data.consultation_time }}
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
        default:
            return t('notifications.types.default');
    }
};

export default function NotificationCard({ notification, onMarkAsRead }) {
    const { t } = useTranslation(); // 4. Initialize hook for the main component
    const navigate = useNavigate();

    const handleClick = () => {
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }
        if (notification.type === 'new_message' && notification.data.conversation_id) {
            navigate(`/messages/${notification.data.conversation_id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-300 ${notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <p className="text-sm text-gray-800">
                        <NotificationMessage notification={notification} />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                </div>
                {!notification.is_read && (
                    <div className="flex-shrink-0 ml-4 mt-1">
                        {/* 5. Use translated aria-label */}
                        <span className="w-3 h-3 bg-indigo-600 rounded-full block" aria-label={t('notifications.unreadAriaLabel')}></span>
                    </div>
                )}
            </div>
        </div>
    );
}