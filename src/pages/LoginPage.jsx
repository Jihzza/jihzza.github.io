// src/pages/LoginPage.jsx

// Page component that holds state, calls Supabase, and redirectts on success.

import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Login from '../components/auth/Login';
import { useAuth } from '../contexts/AuthContext';
import { signInWithPassword } from '../services/authService';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // if already logged in -> bounce to /profile
    useEffect(() => {
        if (isAuthenticated) navigate('/profile');
    }, [isAuthenticated, navigate]);

    // Handle form submit
    const handleLogin = async ({ email, password }) => {
        setLoading(true); setError(null);
        try {
            const { error } = await signInWithPassword(email, password); // Supabase call
            if (error) throw error;
            navigate('/profile'); // fast UX; context listener will also fire
        } catch (err) {
            setError(err.message || 'An unexpected error occured.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Log in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Pass handlers down */}
                    <Login onSubmit={handleLogin} isLoading={loading} />
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}