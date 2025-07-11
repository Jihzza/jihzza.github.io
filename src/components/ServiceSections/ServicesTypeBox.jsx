import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable, animated box for selecting a service type.
 * It's a "dumb" presentational component, receiving all its data and behavior via props.
 * @param {string} icon - The source path for the icon to display.
 * @param {string} title - The title of the service.
 * @param {function} onClick - The function to call when the box is clicked.
 * @param {boolean} isSelected - A flag to determine if the box is currently selected for styling.
 */
export default function ServicesTypeBox({ icon, title, onClick, isSelected }) {
    return (
        <motion.div
            layout // Animate layout changes (e.g., when grid columns change).
            onClick={onClick}
            className={`
                p-4 border-2 rounded-lg cursor-pointer 
                flex flex-col items-center justify-center text-center 
                transition-colors duration-300
                ${isSelected
                    // If selected, we apply a scale transform to make it pop.
                    ? 'border-yellow-400 scale-105 shadow-lg'
                    // If not selected, we use the default gold border.
                    : 'border-[#BFA200]'
                }
            `}
            whileTap={{ scale: 0.95 }} // Add a subtle shrink effect on tap for better UX.
        >
            {/* Icon and Title */}
            <div className="flex-grow flex items-center justify-center">
                <img src={icon} alt={`${title} icon`} className="w-8 h-8" />
            </div>
            <div className="h-auto mt-2 flex items-center justify-center">
                <h3 className="font-semibold text-white text-xs leading-tight">{title}</h3>
            </div>
        </motion.div>
    );
}