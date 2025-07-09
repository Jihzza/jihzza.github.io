// src/components/notifications/NotificationsBell.jsx

import React from 'react';
// --- CHANGE 1: Import the necessary hooks ---
// The "Why": We need `useNavigate` to programmatically navigate and `useLocation`
// to know the user's current URL.
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationIcon from '../../assets/icons/Notifications White.svg';

/**
 * The notification bell icon displayed in the main application header.
 * It shows the number of unread notifications and now intelligently handles
 * its own click behavior, navigating to the notifications page or going back
 * if the user is already there.
 */
export default function NotificationsBell() {
    // --- CHANGE 2: Initialize the hooks and context ---
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();

    // --- CHANGE 3: CREATE THE SMART CLICK HANDLER ---
    /**
     * Navigates the user to the notifications page, or goes back if they
     * are already on the notifications page.
     * The "Why": This encapsulates the component's primary user interaction logic,
     * making it reusable and independent from its parent `Header` component.
     */
    const handleClick = () => {
        // Define the target path for clarity and easy maintenance.
        const notificationsPath = '/notifications';

        // Check if the user's current browser path is the notifications page.
        if (location.pathname === notificationsPath) {
            // If they are already on the page, go back one step in history.
            navigate(-1);
        } else {
            // Otherwise, navigate to the notifications page as the default action.
            navigate(notificationsPath);
        }
    };

    // Determine if the icon should be visually "active"
    const isActive = location.pathname.startsWith('/notifications');

    return (
        <div className="relative">
            {/* --- CHANGE 4: Attach the new handler to the button's onClick event --- */}
            <button
                onClick={handleClick}
                className="relative flex items-center text-white rounded-full"
                aria-label={`Open notifications (${unreadCount} unread)`}
            >
                {/* The "Why": We use the `isActive` boolean to conditionally apply
                    a different text color, providing clear visual feedback to the user.
                */}
                <img src={NotificationIcon} alt="Notifications" className={`h-5 w-5 ${isActive ? 'text-yellow-400' : 'text-white'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-black">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}