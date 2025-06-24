// src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import ForgotPassword from '../components/auth/ForgotPassword';
import { sendPasswordResetEmail } from '../services/authService';
import { Link } from 'react-router-dom';

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
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            {sent ? (
                /* Success Banner */
                <div className="space-y-4 max-w-sm text-center">
                    <h2 className="text-2xl font-bold">Check your inbox</h2>
                    <p className="text-gray-600">
                        If an account exists for that address you'll receive an email&nbsp;shortly.
                    </p>
                    <a 
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-indigo-600 hover:text-indigo-500"
                        >
                        Open Gmail
                    </a>
                    <Link to="/login" className="block underline text-sm text-gray-500">
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