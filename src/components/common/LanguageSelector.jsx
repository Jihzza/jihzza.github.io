// src/components/common/LanguageSelector.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';
import GlobeIcon from '../../assets/icons/Globe Branco.svg';


const languages = [
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
    { key: 'pt-PT', label: 'Português PT'},
    { key: 'pt-BR', label: 'Português BR'},    
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (langKey) => {
        i18n.changeLanguage(langKey);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                // COLOR UPDATE: Adjusted focus ring offset color.
                className="flex items-center text-white rounded-full"
                aria-label="Change language"
            >
                <img src={GlobeIcon} alt="Globe" className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.key}>
                                <button
                                    onClick={() => handleLanguageChange(lang.key)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                                >
                                    <span>{lang.label}</span>
                                    {i18n.language === lang.key && (
                                        <CheckIcon className="h-5 w-5 text-indigo-600" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}