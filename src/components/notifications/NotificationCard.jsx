// src/components/notifications/NotificationCard.jsx

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

/**
 * A helper component that renders the notification text based on its type.
 * This keeps the main component clean and simplifies adding new notification types.
 *
 * @param {object} notification - The notification object.
 * @returns {JSX.Element} The formatted notification message.
 */
const NotificationMessage = ({ notification }) => {
    switch (notification.type) {
        case 'new_message':
            return (
                <>
                    <span className="font-bold">{notification.data.sender_username}</span> sent you a new message.
                </>
            );
        case 'consultation_reminder':
            return (
                <>
                    Reminder: Your consultation is tomorrow at <span className="font-bold">{notification.data.consultation_time}</span>.
                </>
            );
        case 'new_consultation_booking':
            return (
                 <>
                    New Booking: A user purchased a <span className="font-bold">Consultation</span>.
                </>
            );
        default:
            return 'You have a new notification.';
    }
};

/**
 * A reusable, presentational component for a single notification.
 * It displays the message, time, and read status, and handles navigation on click.
 *
 * @param {object} notification - The full notification object from the database.
 * @param {function} onMarkAsRead - A callback function to mark the notification as read.
 */
export default function NotificationCard({ notification, onMarkAsRead }) {
    const navigate = useNavigate();

    /**
     * Handles the click event on a notification card.
     * It marks the notification as read and navigates to the relevant page if applicable.
     */
    const handleClick = () => {
        // Mark as read immediately for a snappy user experience.
        if (!notification.is_read) {
            onMarkAsRead(notification.id);
        }

        // Navigate to the appropriate page based on the notification type.
        if (notification.type === 'new_message' && notification.data.conversation_id) {
            navigate(`/messages/${notification.data.conversation_id}`);
        }
    };

    return (
        // The card's background color changes based on its `is_read` status, providing a clear visual cue.
        <div
            onClick={handleClick}
            className={`
                p-4 border-b border-gray-200 cursor-pointer transition-colors duration-300
                ${notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'}
            `}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <p className="text-sm text-gray-800">
                        <NotificationMessage notification={notification} />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {/* We use date-fns for human-readable timestamps (e.g., "about 2 hours ago"). */}
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                </div>
                {/* A blue dot visually indicates an unread notification. */}
                {!notification.is_read && (
                    <div className="flex-shrink-0 ml-4 mt-1">
                        <span className="w-3 h-3 bg-indigo-600 rounded-full block" aria-label="Unread notification"></span>
                    </div>
                )}
            </div>
        </div>
    );
}