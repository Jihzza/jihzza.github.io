// src/pages/profile/AccountSettings/DeleteAccountSection.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCurrentUser, signOut } from '../../../services/authService';
import FormButton from '../../../components/common/Forms/FormButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const DeleteAccountSection = () => {
    const { t } = useTranslation(); // 2. Initialize hook
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        // 3. Use translated confirmation message
        if (window.confirm(t('accountSettings.deleteAccount.confirm'))) {
            setLoading(true);
            const { error } = await deleteCurrentUser();
            if (error) {
                // 4. Use translated alert messages
                alert(t('accountSettings.deleteAccount.error', { message: error.message }));
                setLoading(false);
            } else {
                alert(t('accountSettings.deleteAccount.success'));
                await signOut();
                navigate('/signup');
            }
        }
    };
    return (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            {/* 5. Use translated texts */}
            <h3 className="text-lg font-semibold text-red-800">{t('accountSettings.deleteAccount.title')}</h3>
            <p className="py-3 text-sm text-red-700">
                {t('accountSettings.deleteAccount.description')}
            </p>
            <FormButton 
                onClick={handleDelete} 
                isLoading={loading} 
                fullWidth
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
                {t('accountSettings.deleteAccount.button')}
            </FormButton>
        </div>
    );
};
export default DeleteAccountSection;