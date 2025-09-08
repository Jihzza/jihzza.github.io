// src/pages/NotificationsPage.jsx

import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import NotificationCard from '../components/notifications/NotificationCard';
import Button from '../components/ui/Button';
import SectionTextWhite from '../components/common/SectionTextWhite';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function NotificationsPage() {
    const { t } = useTranslation(); // 2. Initialize hook
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const renderContent = () => {
        if (loading) {
            // 3. Use translated text
            return <p className="text-center text-gray-500 py-8">{t('notifications.loading')}</p>;
        }

        if (notifications.length === 0) {
            return (
                <div className="text-center text-gray-500 py-8">
                    {/* 4. Use translated text */}
                    <p>{t('notifications.noNotifications')}</p>
                </div>
            );
        }

        return (
            <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200">
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
        <div className="bg-gradient-to-b from-[#002147] to-[#ECEBE5] h-full">
            <ProfileSectionLayout>
                <SectionTextWhite title={t('notifications.pageTitle')} />
                <div className="flex justify-end mb-4">
                    {unreadCount > 0 && (
                        <Button
                            onClick={markAllAsRead}
                            className="text-sm py-2 px-4"
                        >
                            {t('notifications.markAllAsRead', { count: unreadCount })}
                        </Button>
                    )}
                </div>

                {renderContent()}
            </ProfileSectionLayout>
        </div>
    );
}