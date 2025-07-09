// src/components/layout/Header.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

/**
 * The main header for the application.
 * It includes navigation to settings and a notification icon with smart "go back" functionality.
 */
export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // --- NEW LOGIC IS HERE ---

    // Define the path for the notifications page for easy reference.
    const notificationsPath = '/notifications';

    /**
     * Handles the click event for the notification icon.
     * The "Why": This function centralizes the navigation logic for the icon.
     * It checks if the user is already on the notifications page. If so, it
     * navigates back. Otherwise, it takes them to the notifications page.
     * This prevents re-loading the same page and provides a slick UX.
     */
    const handleNotificationsClick = () => {
        // Check if the current URL pathname is the notifications page.
        if (location.pathname === notificationsPath) {
            // If yes, navigate back one step in the browser's history.
            navigate(-1);
        } else {
            // If no, perform the default action: navigate to the notifications page.
            navigate(notificationsPath);
        }
    };

    /**
     * Handles the click event for the settings icon.
     */
    const handleSettingsClick = () => {
        navigate('/settings');
    };

    // Determine if the notification icon should be visually active.
    // This is true if the user is on the /notifications page.
    const isNotificationsActive = location.pathname.startsWith(notificationsPath);

    return (
        <header className="w-full sticky top-0 left-0 right-0 bg-black border-b border-gray-700 shadow-lg z-50">
            <div className="flex justify-between items-center w-full h-14 px-4 mx-auto">
                {/* Logo or App Name would go here */}
                <div className="text-lg font-bold text-white">
                    MyApp
                </div>

                {/* Action Icons */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleNotificationsClick} // Attach our new smart handler
                        className="p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-gray-800"
                        aria-label="Notifications"
                    >
                        <BellIcon className={`h-6 w-6 ${isNotificationsActive ? 'text-yellow-400' : 'text-gray-400'}`} />
                    </button>

                    <button
                        onClick={handleSettingsClick}
                        className="p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-gray-800"
                        aria-label="Settings"
                    >
                        <Cog6ToothIcon className="h-6 w-6 text-gray-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}