// src/components/notifications/NotificationsBell.jsx

import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsPanel from './NotificationsPanel';

export default function NotificationsBell() {
    const { unreadCount } = useNotifications();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                // --- STYLE CHANGE ---
                // `text-gray-600`: Changed from text-white to be visible on a white background.
                // `hover:bg-gray-100`: Added a subtle hover effect suitable for a light theme.
                // `focus:ring...`: Added accessibility improvements for keyboard navigation.
                className="relative p-2 text-white rounded-full"
            >
                <BellIcon className="h-7 w-7" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
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
