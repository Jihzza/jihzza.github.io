// src/components/profile/SettingsSectionHeader.jsx

import React from 'react';

/**
 * A reusable header for sections within settings cards.
 * @param {string} title - The title to display.
 * @param {string} [className] - Optional classes to override default styling.
 */
const SettingsSectionHeader = ({ title, className }) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${className}`}>
            {title}
        </h3>
    );
};

export default SettingsSectionHeader;