// src/components/hero/CtaSection.jsx

import React from 'react';

/**
 * Displayes the main CTA message for the hero section.
 */

export default function CtaSection() {
    return (
        <div className="w-full text-center py-2 space-y-6">
            {/* The main headline */}
            <h1 className="text-2xl font-extrabold text-white leading-tight">
                Unlock Your Best Self—Master Your Mindset, Wealth & Relationships Today
            </h1>
            {/* The subheadline */}
            <p className="text-white max-w-xl mx-auto">
                From bankruptcy to six-figure success, I mastered the three pillars—health, power, and relationships. Now I'm here to help you turn setbacks into a springboard for extraordinary growth.
            </p>
        </div>
    );
}