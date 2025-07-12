// src/pages/profile/AccountSettings/PrivacySettingsSection.jsx

import React, { useState } from 'react';
import FormButton from '../../../components/common/Forms/FormButton';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// ToggleSwitch does not need translation logic internally
const ToggleSwitch = ({ label, description, name, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex-grow">
            <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        {/* ... rest of component is unchanged ... */}
    </div>
);

// SelectInput does not need translation logic internally
const SelectInput = ({ label, description, name, value, onChange, options }) => (
     <div className="py-4 border-b border-gray-200">
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
        <p className="text-xs text-gray-500 mb-2">{description}</p>
        <select
            id={name} name={name} value={value} onChange={onChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


export default function PrivacySettingsSection() {
    const { t } = useTranslation(); // 2. Initialize hook
    const [privacySettings, setPrivacySettings] = useState({ shareAnalytics: true, chatRetention: "6months" });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrivacySettings((prev) => ({...prev, [name]: type === "checkbox" ? checked : value}));
    };

    const handleSave = () => {
        setIsLoading(true);
        setMessage('');
        setTimeout(() => {
            console.log("Saving privacy settings:", privacySettings);
            setMessage(t('accountSettings.privacy.saveSuccess')); // 3. Use translated message
            setIsLoading(false);
        }, 1000);
    }

    // 4. Create options array from translations
    const retentionOptions = Object.entries(t('accountSettings.privacy.retention.options', { returnObjects: true }))
        .map(([value, label]) => ({ value, label }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('accountSettings.privacy.title')}</h3>
            
            <ToggleSwitch
                label={t('accountSettings.privacy.analytics.label')}
                description={t('accountSettings.privacy.analytics.description')}
                name="shareAnalytics"
                checked={privacySettings.shareAnalytics}
                onChange={handlePrivacyChange}
            />

            <SelectInput
                label={t('accountSettings.privacy.retention.label')}
                description={t('accountSettings.privacy.retention.description')}
                name="chatRetention"
                value={privacySettings.chatRetention}
                onChange={handlePrivacyChange}
                options={retentionOptions} // Use translated options
            />

            <div className="py-4 flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-gray-800">{t('accountSettings.privacy.download.title')}</h4>
                    <p className="text-xs text-gray-500">{t('accountSettings.privacy.download.description')}</p>
                </div>
                <FormButton onClick={() => alert(t('accountSettings.privacy.download.alert'))} isLoading={false} className="w-auto text-sm">
                    {t('accountSettings.privacy.download.button')}
                </FormButton>
            </div>


            <div className="mt-6">
                <FormButton onClick={handleSave} isLoading={isLoading} fullWidth>
                    {t('accountSettings.privacy.saveButton')}
                </FormButton>
                {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}