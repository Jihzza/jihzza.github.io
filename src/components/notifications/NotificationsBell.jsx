// src/components/notifications/NotificationsBell.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationIcon from '../../assets/icons/Notifications White.svg';

/**
 * The notification bell icon displayed in the main application header.
 * It shows the number of unread notifications and navigates to the notifications page on click.
 */
export default function NotificationsBell() {
    // --- HOOKS ---
    const { unreadCount } = useNotifications();
    const navigate = useNavigate(); // The standard hook for programmatic navigation.

    /**
     * Navigates the user to the dedicated notifications page.
     */
    const handleClick = () => {
        navigate('/notifications');
    };

    return (
        // The component is now simpler, with no internal state for panel visibility.
        <div className="relative">
            <button
                onClick={handleClick}
                className="relative flex items-center text-white rounded-full"
                aria-label={`Open notifications (${unreadCount} unread)`}
            >
                <img src={NotificationIcon} alt="Notifications" className="h-5 w-5" />
                {/* The badge is only rendered if there are unread notifications. */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-black">
                        {/* For a clean UI, we cap the displayed count at '9+'. */}
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}