// src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';
import { sendPasswordResetEmail } from '../services/authService';
import { Link } from 'react-router-dom';
import SectionTextWhite from '../components/common/SectionTextWhite';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);

    const handleForgot = async ({ email }) => {
        setLoading(true); setError(null);
        const { error } = await sendPasswordResetEmail(email);
        if (error) setError(error.message);
        else setSent(true);
        setLoading(false);
    };

    return (
        <div className="h-full bg-gradient-to-b from-[#002147] to-[#ECEBE5] flex flex-col items-center justify-center p-6">
            {sent ? (
                /* Success Banner */
                <div className="space-y-4 max-w-sm text-center">
                    <SectionTextWhite title="Check Your Inbox">If an account exists for that address you'll receive an email&nbsp;shortly.</SectionTextWhite>
                        
                    <Button 
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Open Gmail
                    </Button>
                    <Link to="/login" className="block underline text-sm text-black">
                        Back to Login
                    </Link>
                </div>
            ) : (
                /* Forgot Password Form */
                    <ForgotPassword onSubmit={handleForgot} isLoading={loading} />
            )}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}