// src/components/hero/Cards/CoachingCard.jsx

import React, { useState } from 'react';
import CtaButton from '../../common/Button';


const tiers = [
  { id: 'basic', price: '40', planName: 'Basic', billingCycle: 'm' },
  { id: 'standard', price: '90', planName: 'Standard', billingCycle: 'm' },
  { id: 'premium', price: '230', planName: 'Premium', billingCycle: 'm' },
];

/**
 * A UI card for the "Direct Coaching" service.
 * Handles two click behaviors: scrolling to the section and initiating scheduling.
 *
 * @param {function} onScheduleClick - Function to initiate the coaching scheduling flow.
 */
export default function CoachingCard({ onScheduleClick }) {

  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const selectedTier = tiers.find(tier => tier.id === selectedPlanId);

  const buttonText = selectedTier
    ? `Get My Number - ${selectedTier.price}€/${selectedTier.billingCycle}`
    : 'Select a Plan';

  const handleCardClick = () => {
    document.getElementById('coaching-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (selectedTier) {
      onScheduleClick(selectedTier);
    }
  };

  const handleTierClick = (e, planId) => {
    e.stopPropagation();
    setSelectedPlanId(planId);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center cursor-pointer"
    >
      <h3 className="text-3xl font-bold text-white">Direct Coaching</h3>
      
      <div className="flex justify-center space-x-2 my-6 w-full">
        {tiers.map((tier) => (
          <div
            key={tier.id} // Use the unique `id` for the key.
            onClick={(e) => handleTierClick(e, tier.id)}
            className={`
              border-2 border-[#BFA200] rounded-md p-3 flex-1 cursor-pointer
              transition-transform duration-300 ease-in-out
              ${selectedPlanId === tier.id ? 'scale-110' : ''}
            `}
          >
            <p className="font-bold text-white text-lg">{tier.price}€</p>
            <p className="text-xs text-white">{tier.planName}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-white">Limited Spots</p>

      <div className="w-full mt-auto flex flex-col justify-center items-center">
        {/* The CtaButton now receives the dynamically generated text as its child. */}
        <CtaButton onClick={handleButtonClick}>{buttonText}</CtaButton>
        <a href="#coaching-section" className="inline-block mt-3 text-sm text-white" onClick={(e) => e.stopPropagation()}>
          Learn More
        </a>
      </div>
    </div>
  );
}