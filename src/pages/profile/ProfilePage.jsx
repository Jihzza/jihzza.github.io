// src/pages/profile/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, signOut } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ full_name: '', avatar_url: '', role: 'user', phone: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                setLoading(true);
                const { data, error: fetchError } = await getProfile(user.id);
                if (fetchError) {
                    setError(t('profile.errors.load'));
                    console.error("Profile fetch error:", fetchError);
                } else if (data) {
                    const finalProfile = { ...data, avatar_url: data.avatar_url || user.user_metadata?.avatar_url };
                    setProfile(finalProfile);
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, t]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const userMenuItems = t('profile.menuItems', { returnObjects: true }).map((item) => ({
        ...item,
        to: `/profile/${item.key}`
    }));

    if (loading) return <div className="p-4 text-center">{t('profile.loading')}</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                fullName={profile.full_name}
                phone={profile.phone}
                avatarUrl={profile.avatar_url}
                onEdit={() => navigate('/profile/edit')}
            />
            <hr />
            <nav className="divide-y divide-gray-200">
                {/* --- THIS IS THE FIX --- */}
                {/* We destructure `key` out and pass the rest of the props via spread */}
                {userMenuItems.map(({ key, ...props }) => (
                    <ProfileMenuItem key={key} {...props} />
                ))}
            </nav>
            <div className="p-4 mt-4">
                 <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                    <span className="text-lg font-medium">{t('profile.logout')}</span>
                </button>
            </div>
        </div>
    );
}