// src/pages/profile/UpdatePasswordForm.jsx

import React, { useState } from 'react';
import { updateUserPassword } from '../../../services/authService';
// --- CHANGE: Import Input and FormButton ---
import Input from '../../../components/common/Forms/Input';
import FormButton from '../../../components/common/Forms/FormButton';

const UpdatePasswordForm = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { error } = await updateUserPassword(password);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Password updated successfully.');
            setPassword('');
        }
        setLoading(false);
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* --- CHANGE: Replaced with reusable Input component --- */}
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    minLength="6"
                />
                {/* --- CHANGE: Replaced with FormButton for consistent styling and state handling --- */}
                <FormButton type="submit" isLoading={loading} fullWidth>
                    Update Password
                </FormButton>
            </form>
            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
        </div>
    );
};
export default UpdatePasswordForm;