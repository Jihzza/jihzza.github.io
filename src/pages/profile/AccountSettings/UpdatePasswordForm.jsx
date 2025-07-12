// src/pages/profile/AccountSettings/UpdatePasswordForm.jsx

import React, { useState } from 'react';
import { updateUserPassword } from '../../../services/authService';
import Input from '../../../components/common/Forms/Input';
import FormButton from '../../../components/common/Forms/FormButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const UpdatePasswordForm = () => {
    const { t } = useTranslation(); // 2. Initialize hook
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { error } = await updateUserPassword(password);
        if (error) {
            setMessage(t('accountSettings.updateEmail.errorMessage', { message: error.message })); // Reuse error message key
        } else {
            // 3. Use translated success message
            setMessage(t('accountSettings.updatePassword.successMessage'));
            setPassword('');
        }
        setLoading(false);
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {/* 4. Use translated title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('accountSettings.updatePassword.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // 5. Use translated placeholder
                    placeholder={t('accountSettings.updatePassword.placeholder')}
                    required
                    minLength="6"
                />
                <FormButton type="submit" isLoading={loading} fullWidth>
                    {/* 6. Use translated button text */}
                    {t('accountSettings.updatePassword.button')}
                </FormButton>
            </form>
            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
        </div>
    );
};
export default UpdatePasswordForm;