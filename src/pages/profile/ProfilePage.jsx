// src/pages/profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, signOut } from '../../services/authService';
import ProfileHeader from '../../components/profile/ProfileHeader';
// 1. Import our new, reusable menu item component.
import ProfileMenuItem from '../../components/profile/ProfileMenuItem';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';


export default function ProfilePage() {
    // --- HOOKS ---
    const { user } = useAuth();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    // A single state object holds all profile-related data.
    const [profile, setProfile] = useState({ full_name: '', avatar_url: '', role: 'user', phone: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- DATA FETCHING ---
    // This effect runs when the `user` object changes (e.g., after login).
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                setLoading(true);
                const { data, error: fetchError } = await getProfile(user.id);

                if (fetchError) {
                    setError('Could not load profile. Please try again later.');
                    console.error("Profile fetch error:", fetchError);
                } else if (data) {
                    // --- STRATEGIC AVATAR LOGIC ---
                    // We create a final profile object that prioritizes the custom avatar_url from our
                    // 'profiles' table, but intelligently falls back to the Google/OAuth avatar if it's not set.
                    // This ensures the user always sees a profile picture.
                    const finalProfile = {
                        ...data,
                        avatar_url: data.avatar_url || user.user_metadata?.avatar_url,
                    };
                    setProfile(finalProfile);
                }
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]); // Dependency array ensures this runs only when the user object is available.

    // --- HANDLERS ---
    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    // --- DATA STRUCTURES FOR MENU ---
    // By defining our navigation links as arrays of objects, we separate our data from the
    // presentation. This makes it incredibly easy to add, remove, or reorder links later
    // without touching the JSX.
    const userMenuItems = [
        { label: 'Appointments', to: '/profile/appointments' },
        { label: 'Subscriptions', to: '/profile/subscriptions' },
        { label: 'Pitch Deck Requests', to: '/profile/pitch-requests' },
        { label: 'Chatbot History', to: '/profile/chatbot-history' },
        { label: 'Account & Settings', to: '/profile/account-settings' },
    ];

    // --- RENDER LOGIC ---
    // Handle loading and error states first for a clean return.
    if (loading) return <div className="p-4 text-center">Loading profile...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* The header component, which is responsible for its own presentation. */}
            <ProfileHeader
                fullName={profile.full_name}
                phone={profile.phone} // Pass the phone number to the header.
                avatarUrl={profile.avatar_url}
                onEdit={() => navigate('/profile/edit')}
            />

            <hr />

            {/* The main navigation list for the user. */}
            <nav className="divide-y divide-gray-200">
                {/* We map over our array to render the menu items, keeping the JSX clean. */}
                {userMenuItems.map(item => <ProfileMenuItem key={item.label} {...item} />)}

            </nav>

            {/* Logout button is styled distinctly and placed at the bottom for clarity. */}
            <div className="p-4 mt-4">
                 <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                    <span className="text-lg font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}