// src/components/consultations/ConsultationTypeBox.jsx

import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable component for type boxes.
 *  It's a presentational component that receives its data and behavior via props
 * @param {string} icon - The icon to display.
 * @param {string} title - The title of the type.
 * @param {function} onClick - The function to call when the box is clicked.
 * @param {boolean} isSelected - A flag to determine if the box is selected.
 */
export default function ServicesTypeBox({ icon, title, onClick, isSelected }) {
    // The motion.div component from framer-motion allows us to add aninmations.
    // whiteTap provides instant visual feedback when the user clicks the item
    return (
        <motion.div
            onClick={onClick}
            className={`
            p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors duration-300
            ${isSelected
                    ? 'scale-105' // When active
                    : 'border-[#BFA200]' // Default
                }
            `}
            whileTap={{ scale: 0.95 }} // Tap animation
        >
            <div className="flex-grow flex items-center justify-center">
                <img
                    src={icon}
                    alt={`${title} icon`}
                    className="w-8 h-8"
                />
            </div>
            <div className="h-auto mt-2 flex items-center justify-center">
                <h3 className="font-semibold text-white text-xs leading-tight">
                    {title}
                </h3>
            </div>
        </motion.div>
    );
}