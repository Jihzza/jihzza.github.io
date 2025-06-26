// src/components/layout/Header.jsx

import React from 'react'; // Imports the core React library to create components.
import NotificationsBell from '../notifications/NotificationsBell'; // Imports the notification component.
import { useAuth } from '../../contexts/AuthContext'; // We need the auth context to know if we should display the header.

/**
 * Header Component (Simplified)
 * This component renders a simple rectangular bar at the top of the application,
 * containing only the notification bell for logged-in users.
 */
export default function Header() {
    // Get the current `user` object from our global AuthContext.
    // This will be null if the user is not logged in.
    const { user } = useAuth();

    // Do not render the header at all if there is no user session.
    // This prevents an empty bar from showing on the login page.
    if (!user) {
        return null;
    }

    return (
        // The <header> semantic HTML tag.
        // `sticky top-0 z-50`: Makes the header "stick" to the top of the screen during scroll. `z-50` ensures it appears above other page content.
        // `bg-white shadow-md`: Sets a white background and adds a subtle box-shadow for a "lifted" effect.
        // `flex items-center justify-end`: Uses Flexbox to align the bell vertically and push it to the far right.
        // `p-4`: Applies padding for spacing.
        <header className="sticky top-0 z-50 bg-blue-900 shadow-md flex items-center justify-end p-4">
            {/* The NotificationsBell component is the only item in the header. */}
            <NotificationsBell />
        </header>
    );
}
