// src/components/hero/Cards/CoachingCard.jsx

import React from 'react';
import Button from '../../common/Button';

/**
 * A UI card for the "Direct Coaching" service.
 * Handles two click behaviors: scrolling to the section and initiating scheduling.
 *
 * @param {function} onScheduleClick - Function to initiate the coaching scheduling flow.
 */
export default function CoachingCard({ onScheduleClick }) {
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
      
      <p className="text-white my-6 text-base">
        Personalized coaching to help you excel. Get direct access to expert guidance tailored to your unique goals.
      </p>

      <div className="w-full mt-auto pt-4">
        <Button onClick={handleButtonClick}>Get My Number</Button>
      </div>
    </div>
  );
}