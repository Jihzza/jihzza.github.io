// src/components/hero/service-cards/ConsultationCard.jsx

import React from 'react';
import CtaButton from '../../common/Button'; // Import our new reusable button.

/**
 * A UI card component for the "Individual Consultation" service.
 * Displays pricing and a primary call-to-action.
 */
export default function ConsultationCard({ onScheduleClick }) {

  const handleCardClick = () => {
    document.getElementById('consultations-section').scrollIntoView({ behavior: 'smooth' });
  }

  const handleButtonClick = (e) => {
    e.stopPropagation();

    onScheduleClick();
  };

  return (
    // The main container for the card with shared styling.
    <div className="bg-transparent border border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center" onClick={handleCardClick}>
      <h3 className="text-3xl font-bold text-white">Individual Consultation</h3>
      
      <div className="my-6">
        <p className="text-3xl font-bold text-white">90€/hour</p>
        <p className="text-sm text-white mt-1">Minimum 45 minutes</p>
      </div>

      <div className="w-full mt-auto"> {/* Pushes button to the bottom if height varies */}
        <CtaButton onClick={handleButtonClick}>Book a Consultation</CtaButton>
        <a href="#" className="inline-block mt-3 text-sm text-white">
          Learn More
        </a>
      </div>
    </div>
  );
}