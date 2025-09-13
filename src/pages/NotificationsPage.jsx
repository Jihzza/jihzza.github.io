// src/pages/NotificationsPage.jsx

import React from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import NotificationCard from '../components/notifications/NotificationCard';
import Button from '../components/ui/Button';
import SectionTextWhite from '../components/common/SectionTextWhite';
import { useTranslation } from 'react-i18next';

export default function NotificationsPage() {
    const { t } = useTranslation();
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useNotifications();

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-12 bg-transparent">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p className="text-gray-300 text-lg">{t('notifications.loading')}</p>
                </div>
            );
        }

        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 bg-transparent">
                    <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0 15 0v5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
                    <p className="text-gray-400 text-center max-w-md">
                        {t('notifications.noNotifications')}
                    </p>
                </div>
            );
        }

        return (
            <div className="bg-transparent overflow-hidden">
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
        <div className="bg-[#002147] min-h-screen">
            <ProfileSectionLayout>
                <div>
                    <SectionTextWhite title={t('notifications.pageTitle')} />
                </div>

                {renderContent()}
            </ProfileSectionLayout>
        </div>
    );
}