// src/pages/profile/AccountSettings/UpdateEmailForm.jsx

import React, { useState } from 'react';
import { updateUserEmail } from '../../../services/authService';
import Input from '../../../components/common/Forms/Input';
import FormButton from '../../../components/common/Forms/FormButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const UpdateEmailForm = () => {
    const { t } = useTranslation(); // 2. Initialize hook
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { error } = await updateUserEmail(email);
        if (error) {
            // 3. Use translated error message with interpolation
            setMessage(t('accountSettings.updateEmail.errorMessage', { message: error.message }));
        } else {
            // 4. Use translated success message
            setMessage(t('accountSettings.updateEmail.successMessage'));
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {/* 5. Use translated title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('accountSettings.updateEmail.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // 6. Use translated placeholder
                    placeholder={t('accountSettings.updateEmail.placeholder')}
                    required
                />
                <FormButton type="submit" isLoading={loading} fullWidth>
                    {/* 7. Use translated button text */}
                    {t('accountSettings.updateEmail.button')}
                </FormButton>
            </form>
            {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}
        </div>
    );
};
export default UpdateEmailForm;