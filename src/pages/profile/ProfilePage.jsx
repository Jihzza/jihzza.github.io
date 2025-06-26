// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/authService';
import Input from '../../components/common/Forms/Input';
import FormButton from '../../components/common/Forms/FormButton';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ full_name: '', username: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                setLoading(true);
                const { data, error } = await getProfile(user.id);
                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        username: data.username || ''
                    });
                }
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const { error } = await updateProfile(user.id, {
            full_name: profile.full_name,
            username: profile.username
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Profile updated successfully!');
        }
        setLoading(false);
    };

    if (loading && !profile.username) {
        return <div className="p-4">Loading profile...</div>;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Input
                        type="email"
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="mt-1 bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profile.full_name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                        placeholder="your-unique-username"
                        className="mt-1"
                    />
                </div>

                <FormButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </FormButton>
            </form>
            {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </div>
    );
}