// src/pages/profile/AccountSettings/LegalLinksSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// LegalLink is a presentational component, no change needed here.
const LegalLink = ({ to, label }) => (
    <Link to={to} className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg">
        <span className="text-base text-gray-800">{label}</span>
        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
    </Link>
);

export default function LegalLinksSection() {
    const { t } = useTranslation(); // 2. Initialize hook

    return (
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
            {/* 3. Use translated title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 px-4 pt-4">{t('accountSettings.legal.title')}</h3>
             <nav className="divide-y divide-gray-200">
                {/* 4. Use translated labels */}
                <LegalLink to="/privacy-policy" label={t('accountSettings.legal.privacyPolicy')} />
                <LegalLink to="/terms-of-service" label={t('accountSettings.legal.termsOfService')} />
             </nav>
        </div>
    );
}