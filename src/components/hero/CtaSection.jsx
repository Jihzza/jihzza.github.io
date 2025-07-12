// src/components/hero/CtaSection.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

/**
 * Displayes the main CTA message for the hero section.
 */

export default function CtaSection() {
    const { t } = useTranslation(); // 2. Initialize the hook

    return (
        <div className="w-full text-center py-2 space-y-6">
            {/* The main headline */}
            <h1 className="text-2xl font-extrabold text-white leading-tight">
                {t('hero.cta.title')} {/* 3. Use the 't' function */}
            </h1>
            {/* The subheadline */}
            <p className="text-white max-w-xl mx-auto">
                {t('hero.cta.subtitle')} {/* 4. Use the 't' function */}
            </p>
        </div>
    );
}