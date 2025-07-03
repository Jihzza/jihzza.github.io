// src/components/hero/Cards/CoachingCard.jsx

import React, { useState } from 'react';
import Button from '../../common/Button';


const tiers = [
  { price: '40€', plan: 'Basic' },
  { price: '90€', plan: 'Standard' },
  { price: '230€', plan: 'Premium' },
];

/**
 * A UI card for the "Direct Coaching" service.
 * Handles two click behaviors: scrolling to the section and initiating scheduling.
 *
 * @param {function} onScheduleClick - Function to initiate the coaching scheduling flow.
 */
export default function CoachingCard({ onScheduleClick }) {
  const [selectedPlan, setSelectedPlan] = useState(tiers[0].plan);

  const handleCardClick = () => {
    document.getElementById('coaching-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onScheduleClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
    >
      <h3 className="text-3xl font-bold text-white">Direct Coaching</h3>
      
      <div className="flex justify-center space-x-2 my-6 w-full">
        {tiers.map((tier) => (
          <div
            key={tier.plan}
            onClick={() => setSelectedPlan(tier.plan)}
            className={`
              border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer
              transition-transform duration-300 ease-in-out
              ${selectedPlan === tier.plan ? 'scale-110' : ''}
            `}
          >
            <p className="font-bold text-white text-lg">{tier.price}</p>
            <p className="text-xs text-white">{tier.plan}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-white">Limited Spots</p>

      <div className="w-full mt-auto pt-4">
        <Button onClick={handleButtonClick}>Get My Number</Button>
      </div>
    </div>
  );
}