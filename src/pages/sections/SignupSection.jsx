// src/pages/sections/SignupSection.jsx

// --- IMPORTS (remain the same) ---
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signUpNewUser } from '../../services/authService';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import Signup from '../../components/auth/Signup';
import EmailVerificationModal from '../../components/auth/EmailVerificationModal';
import { useTranslation } from 'react-i18next';

export default function SignupSection() {
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
        <section className="max-w-4xl mx-auto py-8 text-center md:px-6">
            <SectionTextBlack title={t('signup.title')}>
                {t('signup.subtitle')}
            </SectionTextBlack>

            <div className="mt-8 flex justify-center">
                {/*
                  --- CHANGE IS HERE ---
                  1. We've added a wrapper div with the unique class `homepage-signup-form`.
                     This div isolates our styling rules.
                  2. We removed the "bg-white" and other styling from the inner div, as our new CSS will control the appearance.
                */}
                <div className="homepage-signup-form w-full max-w-md">
                    <div>
                        <Signup onSubmit={handleSignup} isLoading={isLoading} />
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
            
            <EmailVerificationModal
                open={needVerification}
                onClose={() => setNeedVerification(false)}
            />
        </section>
    );
}