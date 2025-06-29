// src/components/pitchdeck/PitchDeckCard.jsx

import React from 'react';

/**
 * A reusable UI card component for display a single pitch deck opportunity
 * It is designed to be a dumb component, meaning it only displays the data
 * it receives via props and does not manage its own state
 * @param {string} icon - The source path for the project's logo
 * @param {string} title - The title of the pitch deck opportunity
 * @param {string} description - A brief description of the pitch deck opportunity
 */
export default function PitchDeckCard({ icon, title, description }) {
    // RENDER LOGIC
    return (
        <div className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 flex flex-col space-y-4 items-center transition-transform duration-300 hover:scale-105">
            <img src={icon} alt={`${title} logo`} className="w-[200px]" />

            {/* Text Content Section */}
            <div className="flex flex-col text-start space-y-2">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-start text-white">{title}</h3>
                {/* Project Description */}
                <p className="text-white text-base">{description}</p>
            </div>
        </div>
    );
}