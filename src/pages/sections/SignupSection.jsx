// src/pages/sections/SignupSection.jsx

// --- IMPORTS (remain the same) ---
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signUpNewUser } from '../../services/authService';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import SectionCta from '../../components/ui/SectionCta';
import Signup from '../../components/auth/Signup';
import EmailVerificationModal from '../../components/auth/EmailVerificationModal';
import { useTranslation } from 'react-i18next';

export default function SignupSection() {
    const sectionRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [needVerification, setNeedVerification] = useState(false);
    const { t } = useTranslation();

    const handleSignup = async ({ email, password }) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await signUpNewUser(email, password);
            if (error) throw error;

            if (!data.session) {
                setNeedVerification(true);
                setIsLoading(false);
                return;
            }
            navigate('/profile');

        } catch (err) {
            setError(err.message || 'An unexpected error occurred during sign up.');
            setIsLoading(false);
        }
    };

    return (
        <section ref={sectionRef} className="max-w-4xl mx-auto py-4 text-center md:px-6">
            <SectionTextBlack title={t('signup.title')}>
                {t('signup.subtitle')}
            </SectionTextBlack>

            <div className="mt-8 flex justify-center">
                <div className="homepage-signup-form w-full max-w-md">
                    <div>
                        <Signup onSubmit={handleSignup} isLoading={isLoading} />
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
            
            <SectionCta sectionRef={sectionRef}>
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        {t('signup.alreadyHaveAccount')}
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        {t('signup.loginButton')}
                    </button>
                </div>
            </SectionCta>
            
            <EmailVerificationModal
                open={needVerification}
                onClose={() => setNeedVerification(false)}
            />
        </section>
    );
}