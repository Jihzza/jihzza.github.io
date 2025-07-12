// src/pages/SignupPage.jsx

// Handles local loading + error, calls Supabase sign-up service, and redirects to /profile on success.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpNewUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import SignUp from '../components/auth/Signup';
import EmailVerificationModal from '../components/auth/EmailVerificationModal';
import SectionTextWhite from '../components/common/SectionTextWhite';

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
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] p-6">
            <SectionTextWhite title="Create an Account"></SectionTextWhite>

            <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
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