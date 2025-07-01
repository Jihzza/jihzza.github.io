// src/pages/profile/DeleteAccountSection.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCurrentUser, signOut } from '../../../services/authService';
// --- CHANGE: Import FormButton ---
import FormButton from '../../../components/common/Forms/FormButton';

const DeleteAccountSection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            setLoading(true);
            const { error } = await deleteCurrentUser();
            if (error) {
                alert(`Failed to delete account: ${error.message}`);
                setLoading(false);
            } else {
                alert('Account deleted successfully.');
                await signOut();
                navigate('/signup');
            }
        }
    };
    return (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800">Danger Zone</h3>
            <p className="py-3 text-sm text-red-700">
                Deleting your account will permanently remove all your data, including appointments, subscriptions, and history. This cannot be undone.
            </p>
            {/* --- CHANGE: Replaced with styled FormButton --- */}
            <FormButton 
                onClick={handleDelete} 
                isLoading={loading} 
                fullWidth
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
                Delete My Account
            </FormButton>
        </div>
    );
};
export default DeleteAccountSection;