// src/components/hero/service-cards/InvestmentCard.jsx

import React from 'react';
// Correctly import the renamed and relocated Button component.
import Button from '../../common/Button';

/**
 * A UI card for the "Invest With Me" section, styled for consistency.
 */
export default function InvestmentCard() {
  return (
    // The main container now uses the final styles from ConsultationCard.
    <div className="bg-transparent border-2 border-[#BFA200] rounded-lg p-6 text-center flex flex-col items-center">
      <h3 className="text-3xl font-bold text-white">Invest With Me</h3>

      <p className="text-white my-6 text-base">
        I'm always launching new ventures. To explore current and upcoming opportunities, request a pitch deck below.
      </p>

      <div className="w-full mt-auto">
        {/* Use the new Button component */}
        <Button>Request Pitch Deck</Button>
        <a href="#" className="inline-block mt-3 text-sm text-white">
          Learn More
        </a>
      </div>
    </div>
  );
}