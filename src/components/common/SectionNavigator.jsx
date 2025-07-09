// src/components/common/SectionNavigator.jsx

import React from 'react';

/**
 * A reusable dumb navigation component for switching between content section
 * It receives a list of available sections, the currently active one, and a callback
 * to notify the parent component when a new section is selected
 * 
 * @param {Array<Object>} sections - List of section objects with title and id properties
 * @param {string} activeSectionId - The ID of the currently active section
 * @param {function} onSelectSection - The callback function to execute when a button is clicked
 */
export default function SectionNavigator({ sections, activeSectionId, onSelectSection }) {
    return (
        <div className="flex justify-start items-center gap-2">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => onSelectSection(section.id)}
                    className={`
                        px-3 py-1 rounded-lg text-sm 
                        ${activeSectionId === section.id
                            ? 'bg-[#BFA200] text-black shadow-lg scale-105' // Active state
                            : 'bg-transparent text-black border-2 border-[#BFA200] hover:bg-[#BFA200] hover:text-black'    // Inactive state
                        }
                      `}
                >
                    {section.label}
                </button>
            ))}
        </div>
    );
}