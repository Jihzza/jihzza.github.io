// src/pages/ResetPasswordPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassword from '../components/auth/ResetPassword';
import { updatePassword } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(user ? 'form' : 'checking');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // if user isn't logged-in yet wait for the PASSWORD_RECOVERY event
    useEffect(() => {
        if (step === 'checking' && user) setStep('form');
    }, [user, step]);

    const handleReset = async ({ password }) => {
        setLoading(true); setError(null);
        const { error } = await updatePassword(password);
        if (error) setError(error.message);
        else navigate('/profile');
        setLoading(false);
    };

    if (step === 'checking')
        return <p className="min-h-screen flex items-center justify-center">Loadind...</p>;

    return (
        <div className="h-full bg-gradient-to-b from-[#002147] to-[#ECEBE5] flex flex-col items-center justify-center p-6">
            <ResetPassword onSubmit={handleReset} isLoading={loading} />
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
}