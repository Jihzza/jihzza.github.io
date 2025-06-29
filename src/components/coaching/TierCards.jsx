// src/components/hero/service-cards/CoachingCard.jsx

import React, { useState } from 'react';

const tiers = [
  { price: '40€', plan: 'Basic', description: 'Answers to all questions weekly' },
  { price: '90€', plan: 'Standard', description: 'Answers to all questions in 48h' },
  { price: '230€', plan: 'Premium', description: 'Answer to all questions ASAP' },
];

/**
 * A UI card for the "Direct Coaching" service with interactive pricing tiers.
 */
export default function TierCards() {
  // --- STATE CHANGE IS HERE ---
  // We now initialize the state to `null`, meaning no plan is selected by default.
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="bg-transparent rounded-lg text-center flex flex-col items-center">

      <div className="flex justify-center space-x-2 my-6 w-full">
        {tiers.map((tier) => (
          <div
            key={tier.plan}
            onClick={() => setSelectedPlan(tier.plan)}
            className={`
              border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer
              transition-transform duration-300 ease-in-out space-y-1
              ${selectedPlan === tier.plan ? 'scale-110' : ''}
            `}
          >
            <p className="font-bold text-white text-lg">{tier.price}</p>
            <p className="text-base font-medium text-white">{tier.plan}</p>
            <p className="text-xs text-white">{tier.description}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-white">Limited Spots</p>
    </div>
  );
}