// src/components/common/BackButton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

/**
 * A reusable button component that navigates the user to the previous page in their history.
 * STYLING CHANGE: The text and icon color have been updated to be light, making them suitable for dark backgrounds.
 */
const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            // The text color is now light gray, hovering to white for better visibility on dark themes.
            className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 md:text-lg"
            aria-label="Go back to the previous page"
        >
            <ArrowLeftIcon className="h-5 w-5 mr-2 md:h-6 md:w-6" />
            Back
        </button>
    );
};

export default BackButton;