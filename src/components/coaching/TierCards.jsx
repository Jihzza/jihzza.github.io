// src/components/hero/service-cards/CoachingCard.jsx

import React, { useState } from 'react';

/**
 * A UI card for the "Direct Coaching" service with interactive pricing tiers.
 */
export default function TierCards({ tiers, selectedPlanId, onTierSelect }) {
  // --- STATE CHANGE IS HERE ---

  const handleTierClick = (e, planId) => {
    onTierSelect?.(selectedPlanId === planId ? null : planId);
  };

  return (
    <div className="bg-transparent rounded-lg text-center flex flex-col items-center">

      <div className="flex justify-center space-x-4 my-6 w-full">      {/* We map over the `tiers` array passed down via props. */}
        {tiers.map((tier) => (
          <div
            key={tier.id}
            onClick={(e) => handleTierClick(e, tier.id)}
            className={`
            border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer transition-transform duration-300 ease-in-out space-y-1
            ${selectedPlanId === tier.id ? 'scale-105' : ''}
          `}
          >
            <p className="font-bold text-white text-lg md:text-2xl">{tier.price}€</p>
            <p className="text-base font-medium text-white md:text-xl">{tier.planName}</p>
            <p className="text-xs text-white md:text-base">{tier.planDesc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}