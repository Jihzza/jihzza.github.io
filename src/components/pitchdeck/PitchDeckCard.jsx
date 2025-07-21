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
        // 1. h-full: Ensures the card fills the height of its container for uniform layouts.
        // 2. flex-col & items-center: Stacks children vertically and centers them horizontally.
        <div className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 h-full">
            
            {/* Logo is at the top. flex-shrink-0 prevents it from shrinking. */}
            <img src={icon} alt={`${title} logo`} className="w-[200px] flex-shrink-0" />

            {/* --- MODIFICATION START --- */}
            {/* This div now acts as a flexible container for the text. */}
            {/* 3. flex-grow: Allows this block to expand and fill all available vertical space. */}
            {/* 4. justify-center: Vertically centers the content (title and description) within this block. */}
            {/* 5. text-center: Horizontally centers the text itself. */}
            <div className="flex flex-col justify-center flex-grow text-left space-y-2">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-white">{title}</h3>
                {/* Project Description */}
                <p className="text-white text-base">{description}</p>
            </div>
            {/* --- MODIFICATION END --- */}
        </div>
    );
}