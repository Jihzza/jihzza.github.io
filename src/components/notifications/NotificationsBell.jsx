// src/components/notifications/NotificationsBell.jsx

import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsPanel from './NotificationsPanel';
import NotificationIcon from '../../assets/icons/Notifications White.svg';

export default function NotificationsBell() {
    const { unreadCount } = useNotifications();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        // The root div only needs to be relative for the panel positioning.
        <div className="relative">
            {/* --- MODIFICATION HERE --- */}
            {/* 1. Added `flex items-center` to vertically center the icon. */}
            {/* 2. Removed `h-full` and `bg-white` and added `p-2` for consistent spacing. */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="relative flex items-center text-white rounded-full"
                aria-label="Open notifications"
            >
                <img src={NotificationIcon} alt="Notifications" className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-black">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            
            <NotificationsPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />
        </div>
    );
}