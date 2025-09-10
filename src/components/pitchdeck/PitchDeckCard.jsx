// src/components/pitchdeck/PitchDeckCard.jsx

import React from 'react';

/**
 * A reusable UI card component for displaying a single pitch deck opportunity.
 * It is designed to be a dumb component, meaning it only displays the data
 * it receives via props and does not manage its own state.
 * @param {string} icon - The source path for the project's logo.
 * @param {string} title - The title of the pitch deck opportunity.
 * @param {string} description - A brief description of the pitch deck opportunity.
 */
export default function PitchDeckCard({ icon, title, description }) {
    // RENDER LOGIC
    return (
        <div className="bg-transparent border-2 border-[#BFA200] rounded-2xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 h-full space-y-2 md:space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            
            <img src={icon} alt={`${title} logo`} className="w-[200px] flex-shrink-0 md:w-[225px]" />

            <div className="flex flex-col justify-center flex-grow text-left space-y-2 md:space-y-4">
                <h3 className="text-xl font-bold text-white md:text-2xl">{title}</h3>
                <p className="text-white text-base md:text-lg">{description}</p>
            </div>
        </div>
    );
}