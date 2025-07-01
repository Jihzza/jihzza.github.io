// src/pages/profile/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/authService';
import Input from '../../components/common/Forms/Input';
import FormButton from '../../components/common/Forms/FormButton';
import AvatarUploader from '../../components/profile/AvatarUploader'; // Import the new component
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); // State for the avatar URL

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                setLoading(true);
                setEmail(user.email || '');

                const { data: profileData, error: fetchError } = await getProfile(user.id);

                if (fetchError) {
                    setError('Failed to load profile data.');
                } else if (profileData) {
                    setFullName(profileData.full_name || '');
                    setUsername(profileData.username || '');
                    setPhone(profileData.phone || '');
                    // Set avatar from profiles table, falling back to Google/OAuth avatar
                    setAvatarUrl(profileData.avatar_url || user.user_metadata?.avatar_url);
                }
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    // --- HANDLERS ---
    const handleAvatarSuccess = (newUrl) => {
        // Update the avatar URL in the state to re-render the image instantly
        setAvatarUrl(newUrl);
        setMessage('Avatar updated successfully!');
        // Clear the message after a few seconds
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        // The avatar is updated separately by its component, so we only save text fields here.
        const updates = {
            full_name: fullName,
            username: username,
            phone: phone,
        };

        const { error: updateError } = await updateProfile(user.id, updates);

        if (updateError) {
            if (updateError.message.includes('duplicate key value violates unique constraint')) {
                setError(`Username "${username}" is already taken.`);
            } else {
                setError('Failed to update profile. Please try again.');
            }
        } else {
            setMessage('Profile details saved successfully!');
            setTimeout(() => navigate('/profile'), 500);
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // --- RENDER ---
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-500 mt-1">Update your photo and personal details.</p>
            </div>

            {/* AVATAR UPLOADER */}
            <div className="mb-8">
                <AvatarUploader
                    currentAvatarUrl={avatarUrl}
                    onUploadSuccess={handleAvatarSuccess}
                />
            </div>
            
            <hr className="mb-8" />

            <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Email, Username, Full Name, Phone... (no changes to these fields) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input id="email" type="email" value={email} disabled={true} className="bg-gray-100 cursor-not-allowed" />
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                        <InformationCircleIcon className="h-4 w-4 mr-1.5" />
                        Email address cannot be changed.
                    </div>
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                
                {/* Form Submission & Feedback */}
                <div className="pt-4">
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
                    <FormButton type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </FormButton>
                </div>
                 <button type="button" onClick={() => navigate('/profile')} className="mt-2 w-full text-center py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Cancel
                </button>
            </form>
        </div>
    );
}