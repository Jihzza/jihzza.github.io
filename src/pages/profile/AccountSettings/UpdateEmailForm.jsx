// src/pages/profile/UpdateEmailForm.jsx

import React, { useState } from 'react';
import { updateUserEmail } from '../../../services/authService';
// --- CHANGE: Import Input and FormButton ---
import Input from '../../../components/common/Forms/Input';
import FormButton from '../../../components/common/Forms/FormButton';

const UpdateEmailForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { error } = await updateUserEmail(email);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Confirmation email sent to both old and new addresses. Please verify to complete the change.');
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Email</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* --- CHANGE: Replaced with reusable Input component --- */}
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="New Email Address"
                    required
                />
                {/* --- CHANGE: Replaced with FormButton for consistent loading state --- */}
                <FormButton type="submit" isLoading={loading} fullWidth>
                    Update Email
                </FormButton>
            </form>
            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
        </div>
    );
};
export default UpdateEmailForm;