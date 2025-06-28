// src/components/hero/LearnFromHeader.jsx

import React from 'react';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';

/**
 * A simple header component for the hero section.
 * Displays "Learn from" followed by the client's logo.
 * It's designed to be clean and reusable.
 */
export default function LearnFromHeader() {
    return (
        // The main container uses flexbox to align items horizontally and center them vertically
        <div className="flex items-center justify-center py-2">
            <span className="text-xl font-bold text-white mr-2">Learn from</span>
            <img src={DaGalowLogo} alt="DaGalow Logo" className="h-6" />
        </div>
    );
}