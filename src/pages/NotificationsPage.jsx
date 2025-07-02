// src/pages/NotificationsPage.jsx

import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import NotificationCard from '../components/notifications/NotificationCard';
import Button from '../components/common/Button';
import SectionTextBlack from '../components/common/SectionTextBlack';

/**
 * The primary page for displaying all user notifications.
 * It uses the `useNotifications` context to fetch and display data,
 * keeping the component itself clean and focused on presentation.
 */
export default function NotificationsPage() {
    // --- HOOKS ---
    // We abstract all data logic into our custom `useNotifications` hook.
    // This is a key pattern for separating concerns.
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    // --- RENDER LOGIC ---

    /**
     * Renders the main content based on the current data-fetching state.
     * @returns {JSX.Element}
     */
    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500 py-8">Loading notifications...</p>;
        }

        if (notifications.length === 0) {
            return (
                <div className="text-center text-gray-500 py-8">
                    <p>You have no notifications at the moment.</p>
                </div>
            );
        }

        // Map over the notifications array to render a `NotificationCard` for each item.
        return (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>
                            <NotificationCard
                                notification={notification}
                                onMarkAsRead={markAsRead}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        // We use our existing `ProfileSectionLayout` for a consistent look and feel.
        <ProfileSectionLayout>
            <SectionTextBlack title="Notifications" />

            <div className="flex justify-end mb-4">
                {/* The "Mark all as read" button is conditionally rendered and disabled if not needed. */}
                {unreadCount > 0 && (
                    <Button
                        onClick={markAllAsRead}
                        className="text-sm py-2 px-4" // Custom sizing for this context
                    >
                        Mark all as read ({unreadCount})
                    </Button>
                )}
            </div>

            {renderContent()}
        </ProfileSectionLayout>
    );
}