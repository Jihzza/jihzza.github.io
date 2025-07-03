// src/components/hero/ServicesPreview.jsx

import React from 'react';

// Import the new, detailed service card components.
import ConsultationCard from './Cards/ConsultationCard';
import CoachingCard from './Cards/CoachingCard';
import InvestmentCard from './Cards/InvestmentCard';

/**
 * A component to display a preview of the main services offered.
 * This now renders a vertical stack of detailed service cards.
 */
export default function ServicesPreview({ onScheduleConsultation, onScheduleCoaching, onScheduleInvestment }) {
  return (
    // `px-4` for horizontal padding.
    // `py-8` for vertical spacing.
    <div className="py-2">
      {/* This is the main container for the service cards.
        - `flex flex-col`: Stacks the items vertically.
        - `space-y-4`: Adds vertical space between each card.
        - `max-w-xl mx-auto`: Constrains the width and centers it on larger screens.
      */}
      <div className="flex flex-col space-y-4 max-w-xl mx-auto">
        {/* We render each of our new card components in order. */}
        <ConsultationCard />
        <CoachingCard />
        <InvestmentCard />
      </div>
    </div>
  );
}