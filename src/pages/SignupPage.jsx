// src/pages/SignupPage.jsx

// Handles local loading + error, calls Supabase sign-up service, and redirects to /profile on success.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpNewUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import SignUp from '../components/auth/Signup';
import EmailVerificationModal from '../components/auth/EmailVerificationModal';

export default function SignupPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [needVerification, setNeedVerification] = useState(false);

    // Redirect away if user is already loggeed in
    useEffect(() => {
        if (isAuthenticated) navigate('/profile');
    }, [isAuthenticated, navigate]);

    // Handler receives { email, password, confirm } from the child form
    const handleSignup = async ({ email, password }) => {
        setIsLoading(true); setError(null);
        try {
            // Call Supabase helper: it returns {data, error }
            const { data, error } = await signUpNewUser(email, password);
            if (error) throw error;

            /* If Confirm-email ON: session === null */
            if (!data.session) {
                setNeedVerification(true); // show modal instead of redirect
                return;
            }
            navigate('/profile');

        } catch (err) {
            setError(err.message || 'Unexpected error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Create an Account</h2>

            <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
                <SignUp onSubmit={handleSignup} isLoading={isLoading} />

                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                {/* Modal lives at root so screen-readers see it next */}
                <EmailVerificationModal
                    open={needVerification}
                    onClose={() => setNeedVerification(false)}
                />
            </div>
        </div>
    );
}