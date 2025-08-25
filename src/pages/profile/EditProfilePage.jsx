// src/pages/profile/EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/authService';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import Input from '../../components/common/Forms/Input';
import FormButton from '../../components/common/Forms/FormButton';
import AvatarUploader from '../../components/profile/AvatarUploader';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
    const { t } = useTranslation(); // 2. Initialize hook
    const { user } = useAuth();
    const navigate = useNavigate();
    // strip any leading @ and spaces
    const normalizeUsername = (raw) => raw.replace(/^@+/, '').trim();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                setLoading(true);
                setEmail(user.email || '');
                const { data: profileData, error: fetchError } = await getProfile(user.id);
                if (fetchError) {
                    setError(t('editProfile.errors.load'));
                } else if (profileData) {
                    setFullName(profileData.full_name || '');
                    setUsername(profileData.username || '');
                    setPhone(profileData.phone || '');
                    setAvatarUrl(profileData.avatar_url || user.user_metadata?.avatar_url);
                }
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user, t]);

    const handleAvatarSuccess = (newUrl) => {
        setAvatarUrl(newUrl);
        setMessage(t('editProfile.messages.avatarSuccess'));
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        const updates = { full_name: fullName, username: username, phone: phone };
        const { error: updateError } = await updateProfile(user.id, updates);

        if (updateError) {
            if (updateError.message.includes('duplicate key value violates unique constraint')) {
                setError(t('editProfile.errors.usernameTaken', { username }));
            } else {
                setError(t('editProfile.errors.update'));
            }
        } else {
            setMessage(t('editProfile.messages.profileSuccess'));
            setTimeout(() => navigate('/profile'), 500);
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center">{t('editProfile.loading')}</div>;

    // 3. Render page with translated text
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">{t('editProfile.title')}</h1>

            </div>

            <div className="mb-8">
                <AvatarUploader currentAvatarUrl={avatarUrl} onUploadSuccess={handleAvatarSuccess} />
            </div>

            <hr className="mb-8 text-white" />

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">{t('editProfile.form.email.label')}</label>
                    <Input id="email" type="email" value={email} disabled={true} className="w-full px-3 py-2 mt-2 border-2 border-[#BFA200] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BFA200] focus:border-[#BFA200] md:text-lg" />
                    <div className="flex items-center mt-2 text-xs text-white/50">
                        <InformationCircleIcon className="h-4 w-4 mr-1.5" />
                        {t('editProfile.form.email.info')}
                    </div>
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-white">
                        {t('editProfile.form.username.label')}
                    </label>

                    <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">@</span>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(normalizeUsername(e.target.value))}
                            required
                            className="pl-7"  // add left padding so text doesn't overlap the "@"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-white">{t('editProfile.form.fullName.label')}</label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white">{t('editProfile.form.phone.label')}</label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="pt-4">
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
                    <FormButton type="submit" disabled={saving}>
                        {saving ? t('editProfile.form.buttons.saving') : t('editProfile.form.buttons.save')}
                    </FormButton>
                </div>
                <button type="button" onClick={() => navigate('/profile')} className="mt-2 w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                    {t('editProfile.form.buttons.cancel')}
                </button>
            </form>
        </div>
    );
}