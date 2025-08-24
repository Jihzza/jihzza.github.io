// src/components/consultations/ConsultationDetailBlock.jsx

import React from 'react'

/**
 * A simple, reusable component for displaying consultation details.
 * @param {string} icon - The icon to display.
 * @param {string} title - The title of the detail.
 * @param {string} description - The description of the detail.
 */
export default function StepsList({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-4">
      <div className="flex-shrink-0 rounded-full p-4 bg-white border-1 border-white/15 text-white md:p-5">
        <img src={icon} alt={`${title} icon`} className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      <div className="flex flex-col items-center text-center space-y-2 md:space-y-4">
        {/* Heading: LH ~1.25 (1.1–1.3 range) + 1.5% letter-spacing */}
        <h4 className="font-bold text-white text-lg leading-tight tracking-[0.015em] md:text-2xl">{title}</h4>
        {/* Body: LH ~1.45 (1.3–1.5 range) for readability at small sizes */}
        <p className="text-white text-sm leading-[1.45] md:text-lg">{description}</p>
      </div>
    </div>
  );
}