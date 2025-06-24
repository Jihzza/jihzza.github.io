// src/pages/profile/ProfilePage.jsx

// A protected page that shows the user info and a Log-out button

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signOut } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
    const navigate = useNavigate(); // give us navigate('/path')
    const { user } = useAuth(); // user = { id, email, ... }
    const [loading, setLoading] = useState(false);

    // click-handler: call Supabase, then redirect
    const handleLogout = async () => {
        setLoading(true);
        const { error } = await signOut(); // client clears session && tokens
        if (error) {
            console.error(error.message); // you might show a toast instead
        }
        /* onAuthStateChange inside AuthContext will also fire "SIGNED_OUT" but we navigate manually for snappy UX. */
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 space-y-8">
            {/* Profile info */}
            <h1 className="text-red-500">Welcome, {user.email}</h1>

            {/* Logout button */}
            <button 
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                {loading ? 'Signing out...' : 'Log out'}
            </button>
        </div>
    );
}