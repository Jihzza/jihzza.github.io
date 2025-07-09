// src/components/hero/service-cards/CoachingCard.jsx

import React, { useState } from 'react';

/**
 * A UI card for the "Direct Coaching" service with interactive pricing tiers.
 */
export default function TierCards({ tiers, selectedPlanId, onTierSelect }) {
  // --- STATE CHANGE IS HERE ---

  const handleTierClick = (e, planId) => {
    onTierSelect(planId);
  };

  return (
<div className="bg-transparent rounded-lg text-center flex flex-col items-center">

<div className="flex justify-center space-x-2 my-6 w-full">      {/* We map over the `tiers` array passed down via props. */}
      {tiers.map((tier) => (
        <div
          key={tier.id}
          onClick={(e) => handleTierClick(e, tier.id)}
          className={`
            border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer
        transition-transform duration-300 ease-in-out space-y-1
            ${selectedPlanId === tier.id ? 'scale-110' : ''}
          `}
        >
          <p className="font-bold text-white text-lg">{tier.price}€</p>
          <p className="text-base font-medium text-white">{tier.planName}</p>
          <p className="text-xs text-white">{tier.planDesc}</p>
        </div>
      ))}
    </div>
    </div>
  );
}