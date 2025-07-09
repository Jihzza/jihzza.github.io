import React, { useState } from 'react';
import FormButton from '../../../components/common/Forms/FormButton';

// Reusable Toggle Switch Component
const ToggleSwitch = ({ label, description, name, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div className="flex-grow">
            <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
                type="checkbox" 
                name={name} 
                id={name} 
                checked={checked}
                onChange={onChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label htmlFor={name} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
        <style>{`.toggle-checkbox:checked { right: 0; border-color: #BFA200; } .toggle-checkbox:checked + .toggle-label { background-color: #BFA200; }`}</style>
    </div>
);

// Reusable Select Input Component
const SelectInput = ({ label, description, name, value, onChange, options }) => (
     <div className="py-4 border-b border-gray-200">
        <label htmlFor={name} className="block text-sm font-medium text-gray-800">{label}</label>
        <p className="text-xs text-gray-500 mb-2">{description}</p>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


export default function PrivacySettingsSection() {
    const [privacySettings, setPrivacySettings] = useState({
        shareAnalytics: true,
        chatRetention: "6months",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePrivacyChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrivacySettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = () => {
        setIsLoading(true);
        setMessage('');
        // Mock API call
        setTimeout(() => {
            console.log("Saving privacy settings:", privacySettings);
            setMessage("Privacy settings saved successfully!");
            setIsLoading(false);
        }, 1000);
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy & Data</h3>
            
            <ToggleSwitch
                label="Usage Analytics"
                description="Allow us to collect anonymous usage data to improve our services."
                name="shareAnalytics"
                checked={privacySettings.shareAnalytics}
                onChange={handlePrivacyChange}
            />

            <SelectInput
                label="Data Retention"
                description="Choose how long we keep your consultation chat history."
                name="chatRetention"
                value={privacySettings.chatRetention}
                onChange={handlePrivacyChange}
                options={[
                    { value: "1month", label: "1 Month" },
                    { value: "3months", label: "3 Months" },
                    { value: "6months", label: "6 Months" },
                    { value: "1year", label: "1 Year" },
                    { value: "forever", label: "Indefinitely" },
                ]}
            />

            <div className="py-4 flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-gray-800">Download Your Data</h4>
                    <p className="text-xs text-gray-500">Request a copy of all your personal data.</p>
                </div>
                <FormButton onClick={() => alert("Data request sent!")} isLoading={false} className="w-auto text-sm">
                    Request Data
                </FormButton>
            </div>


            <div className="mt-6">
                <FormButton onClick={handleSave} isLoading={isLoading} fullWidth>
                    Save Privacy Settings
                </FormButton>
                {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}