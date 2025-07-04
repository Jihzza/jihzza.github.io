// src/components/hero/Cards/InvestmentCard.jsx

import React from 'react';
import Button from '../../common/Button';

/**
 * A UI card for the "Invest With Me" service.
 * Handles two click behaviors: scrolling to the section and initiating a request.
 *
 * @param {function} onScheduleClick - Function to initiate the pitch deck request flow.
 */
export default function InvestmentCard({ onScheduleClick }) {
  const handleCardClick = () => {
    document.getElementById('invest-section')?.scrollIntoView({ behavior: 'smooth' });
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
      <h3 className="text-3xl font-bold text-white">Invest With Me</h3>

      <p className="text-white my-6 text-base">
        I'm always launching new ventures. To explore current and upcoming opportunities, request a pitch deck below.
      </p>

      <div className="w-full mt-auto">
        <Button onClick={handleButtonClick}>Request Pitch Deck</Button>
      </div>
    </div>
  );
}